import json
from difflib import get_close_matches
from sentence_transformers import SentenceTransformer, util
from app import app
import google.generativeai as genai
import os
import glob
import time
import random
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

pasta_docs = "Docs/Artigos"

try:
    nltk.download('stopwords')
except:
    pass
try:
    genai.configure(api_key=app.config['API'])
    modelo_gemini = genai.GenerativeModel("gemini-2.0-flash-lite")
    gemini_disponivel = True
    print("Gemini configurado com sucesso!")
except Exception as e:
    print(f"Erro na configuração do Gemini: {e}")
    gemini_disponivel = False

modelo_emb = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

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

def preprocessar_texto(texto):
    # Converter para minúsculas
    texto = texto.lower()
    
    # Remover caracteres especiais e números
    texto = re.sub(r'[^a-záàâãéèêíïóôõöúçñ\s]', '', texto)
    
    # Remover stopwords
    stop_words = set(stopwords.words('portuguese'))
    palavras = texto.split()
    palavras = [palavra for palavra in palavras if palavra not in stop_words]
    
    # Aplicar stemming
    stemmer = PorterStemmer()
    palavras = [stemmer.stem(palavra) for palavra in palavras]
    
    return ' '.join(palavras)

def busca_semantica(entrada):
    try:
        entrada_processed = preprocessar_texto(entrada)
        
        emb_entrada = modelo_emb.encode(entrada_processed, convert_to_tensor=True)
        similaridades = util.cos_sim(emb_entrada, emb_topicos)
        
        top_k = 3
        indices = similaridades.argsort(descending=True)[0][:top_k]
        
        melhor_index = indices[0].item()
        melhor_similaridade = similaridades[0][melhor_index].item()
        
        print(f"Melhor similaridade: {melhor_similaridade:.3f}")
        print(f"Top 3 similaridades: {[similaridades[0][i].item() for i in indices]}")
        
        threshold = 0.65 
        
        if melhor_similaridade >= threshold:
            return respostas[melhor_index], melhor_similaridade
        
        return None, melhor_similaridade
        
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

def recarregarDados():
    global dados
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

def UsarGemini(texto, ConversasPassadas):
    if gemini_disponivel:
        try:
            contexto = "\n".join([f"Tópico: {t['topico']}\nResposta: {t['resposta']}" for t in dados])
            
            prompt = f"""
            Você é um assistente especialista em atender as perguntas de um usuário. 

            **Contexto da base de conhecimento:**
            {contexto}
            **Conversas passadas que já teve com ele no chat:**
            {ConversasPassadas}

            **Instruções:**
            1. Use as conversas passadas como referência de como falar com a pessoa.
            2. Use o contexto acima como referência de conhecimento, mas não se limite apenas a ele caso não encontre a resposta.
            3. Se for algo muito específico que não está no contexto, responda com seu conhecimento geral.
            4. Seja educado, claro e direto.

            **Pergunta do usuário:** {texto}

            **Sua resposta:**
            """

            time.sleep(2 + random.uniform(0, 1))
            
            resposta_gerada = modelo_gemini.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=300,
                    top_p=0.9
                )
            )

            if resposta_gerada.candidates:
                texto_resposta = resposta_gerada.candidates[0].content.parts[0].text
                texto_resposta = texto_resposta.replace("**", "")
            else:
                texto_resposta = "Nenhuma resposta gerada."

            if ("não encontrei" in texto_resposta.lower() 
                or len(texto_resposta.strip()) < 30 
                or "nenhuma resposta" in texto_resposta.lower()
                or "Desculpe" in texto_resposta, "não encontrei" in texto_resposta.lower()
                or "Desculpe" in texto_resposta.lower()
                or "não encontrei" in texto_resposta.lower() or
                "não achei" in texto_resposta.lower() or
                "não consegui" in texto_resposta.lower()):
                print("pesquisa externa")

                prompt_pesquisa = f"""
                O usuário perguntou: "{texto}"

                Responda de forma clara, educada e direta, como se fosse você.
                """

                resposta_pesquisa = modelo_gemini.generate_content(
                    prompt_pesquisa,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.7,
                        max_output_tokens=300,
                        top_p=0.9
                    )
                )

                if resposta_pesquisa.candidates:
                    texto_resposta = resposta_pesquisa.candidates[0].content.parts[0].text
                    texto_resposta = texto_resposta.replace("**", "")
                else:
                    texto_resposta = "Não encontrei informações relevantes nem na pesquisa externa."

            return f"🤖 Resposta do bot:\n{texto_resposta}"
            
        except Exception as e:
            print(f"Erro no Gemini: {e}")
            return f"⚠️ Gemini indisponível. Resposta local:\n{resposta_fallback_local(texto, dados)}"
    else:
        return f"📋 Resposta da base local:\n{resposta_fallback_local(texto, dados)}"

def CriarChamadoParaBanco(text):
    """
    Gera automaticamente um ticket estruturado (title, description, prioridade)
    a partir de um texto livre do usuário.
    """
    try:
        prioridade = "média"
        texto_lower = text.lower()
        if any(p in texto_lower for p in ["urgente", "imediato", "crítico", "falha total", "parado"]):
            prioridade = "alta"
        elif any(p in texto_lower for p in ["quando possível", "sem pressa", "melhoria", "sugestão"]):
            prioridade = "baixa"
        print("to aqui")
        if gemini_disponivel:
            prompt = f"""
            Você é um assistente de suporte técnico.  
            Dado o texto do usuário: "{text}"

            Crie um ticket estruturado em JSON com os seguintes campos:
            - title: título breve e descritivo
            - description: descrição mais detalhada, e com mais termos que o titulo.
            - prioridade: alta, média ou baixa (com base no texto)

            Retorne somente o JSON válido.
            A resposta deve ter no maximo 47 palavras
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
                if resposta.candidates:
                    # Extrai o texto da resposta
                    texto = resposta.candidates[0].content.parts[0].text
                    texto_limpo = texto.replace("```json", "").replace("```", "").strip()
                    ticket = json.loads(texto_limpo)
                    return ticket
            except:
                return {
                    "title": text[:50] + ("..." if len(text) > 50 else ""),
                    "description": text,
                    "prioridade": prioridade
                }
        else:
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
    if resposta_semantica and similaridade > 0.6:
        return f"{resposta_semantica}", similaridade
    
    # Se não encontrou boa correspondência semântica, pergunta se quer usar Gemini
    return False