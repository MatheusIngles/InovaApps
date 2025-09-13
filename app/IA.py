import json
from difflib import get_close_matches
from sentence_transformers import SentenceTransformer, util
from app import app
import google.generativeai as genai
import os
import glob
import time
import random

pasta_docs = "Docs/Artigos"

try:
    genai.configure(api_key=app.config['API'])
    modelo_gemini = genai.GenerativeModel("gemini-2.0-flash-lite")
    gemini_disponivel = True
    print("Gemini configurado com sucesso!")
except Exception as e:
    print(f"Erro na configuração do Gemini: {e}")
    gemini_disponivel = False

modelo_emb = SentenceTransformer('all-MiniLM-L6-v2')

arquivos_json = glob.glob(os.path.join(pasta_docs, "artigo_*.json"))
dados = []
for arquivo in arquivos_json:
    try:
        with open(arquivo, "r", encoding="utf-8") as f:
            artigos = json.load(f)
            dados.extend(artigos)
            print(f"Arquivo {arquivo} carregado com sucesso!")
    except Exception as e:
        print(f"Erro ao carregar {arquivo}: {e}")

if not dados:
    print("Nenhum dado foi carregado. Verifique os arquivos JSON.")
    exit()

topicos = [item["topico"] for item in dados]
respostas = [item["resposta"] for item in dados]
emb_topicos = modelo_emb.encode(topicos, convert_to_tensor=True)

def busca_semantica(entrada):
    try:
        emb_entrada = modelo_emb.encode(entrada, convert_to_tensor=True)
        similaridades = util.cos_sim(emb_entrada, emb_topicos)
        index = similaridades.argmax().item()
        similaridade = similaridades[0][index].item()
        
        print(f"Similaridade encontrada: {similaridade:.3f}")
        
        if similaridade >= 0.78: 
            return respostas[index], similaridade
        return None, similaridade
    except Exception as e:
        print(f"Erro na busca semântica: {e}")
        return None, 0

def resposta_fallback_local(pergunta, dados_contexto):
    palavras_chave = pergunta.lower().split()
    respostas_relevantes = []
    
    for item in dados_contexto:
        topico_lower = item["topico"].lower()
        resposta = item["resposta"]
        
        correspondencias = sum(1 for palavra in palavras_chave if palavra in topico_lower)
        if correspondencias > 0:
            respostas_relevantes.append((resposta, correspondencias))
    
    if respostas_relevantes:
        respostas_relevantes.sort(key=lambda x: x[1], reverse=True)
        return respostas_relevantes[0][0]
    
    return "Desculpe, não encontrei informações específicas sobre isso na base de conhecimento."

def UsarGemini(texto):
    if gemini_disponivel:
        try:
            contexto = "\n".join([f"Tópico: {t['topico']}\nResposta: {t['resposta']}" for t in dados])
            
            prompt = f"""
            Você é um assistente especialista em programação e tecnologia. 

            **Contexto da base de conhecimento:**
            {contexto}

            **Instruções:**
            2. Use o contexto acima como referência, mas não se limite apenas a ele
            3. Se for algo muito específico que não está no contexto, responda com seu conhecimento geral
            4. Seja educado, claro e direto
            5. Responda em no maximo 47 palavras

            **Pergunta do usuário:** {texto}

            **Sua resposta:**
            """

            # Adicionar delay para evitar rate limiting
            time.sleep(2 + random.uniform(0, 1))
            
            resposta_gerada = modelo_gemini.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=100,
                    top_p=0.9
                )
            )
            if resposta_gerada.candidates:
                texto = resposta_gerada.candidates[0].content.parts[0].text
                texto = texto.replace("**", "")
            else:
                texto = "Nenhuma resposta gerada."
            return f"🤖 Resposta do bot:\n{texto}"
            
        except Exception as e:
            print(f"Erro no Gemini: {e}")
            # Fallback para resposta local
            return f"⚠️ Gemini indisponível. Resposta local:\n{resposta_fallback_local(texto, dados)}"
    else:
        # Fallback completo para resposta local
        return f"📋 Resposta da base local:\n{resposta_fallback_local(texto, dados)}"

def CriarChamadoParaBanco(text):
    """
    Gera automaticamente um ticket estruturado (title, description, prioridade)
    a partir de um texto livre do usuário.
    """
    try:
        # Heurística simples para prioridade
        prioridade = "média"
        texto_lower = text.lower()
        if any(p in texto_lower for p in ["urgente", "imediato", "crítico", "falha total", "parado"]):
            prioridade = "alta"
        elif any(p in texto_lower for p in ["quando possível", "sem pressa", "melhoria", "sugestão"]):
            prioridade = "baixa"
        
        if gemini_disponivel:
            # Usar Gemini para enriquecer o ticket
            prompt = f"""
            Você é um assistente de suporte técnico.  
            Dado o texto do usuário: "{text}"

            Crie um ticket estruturado em JSON com os seguintes campos:
            - title: título breve e descritivo
            - description: descrição mais detalhada
            - prioridade: alta, média ou baixa (com base no texto)

            Retorne somente o JSON válido.
            """
            resposta = modelo_gemini.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=150,
                    top_p=0.9
                )
            )
            try:
                ticket = json.loads(resposta.text)
                return ticket
            except:
                # Fallback caso Gemini não retorne JSON válido
                return {
                    "title": text[:50] + ("..." if len(text) > 50 else ""),
                    "description": text,
                    "prioridade": prioridade
                }
        else:
            # Fallback completo: só heurística local
            return {
                "title": text[:50] + ("..." if len(text) > 50 else ""),
                "description": text,
                "prioridade": prioridade
            }

    except Exception as e:
        print(f"Erro ao criar chamado: {e}")
        return {
            "title": "Erro ao processar chamado",
            "description": f"Texto original: {text}",
            "prioridade": "média"
        }

def responder_usuario(texto):
    print(f"\n🔍 Processando: '{texto}'")
    
    # Sempre tenta busca semântica primeiro (gratuita)
    resposta_semantica, similaridade = busca_semantica(texto)
    if resposta_semantica and similaridade > 0.7:
        return f"{resposta_semantica}"
    
    # Se não encontrou boa correspondência semântica, pergunta se quer usar Gemini
    return False