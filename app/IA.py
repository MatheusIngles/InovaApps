from app import app
import json
from difflib import get_close_matches
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai

genai.configure(api_key=app.config["Api_Key"])
modelo_emb = SentenceTransformer('all-MiniLM-L6-v2')
modelo = genai.GenerativeModel("gemini-2.5-pro-exp-03-25")  # exemplo de modelo

with open("respostas.json", "r", encoding="utf-8") as f:
    dados = json.load(f)

topicos = [item["topico"] for item in dados]
respostas = [item["resposta"] for item in dados]
emb_topicos = modelo_emb.encode(topicos, convert_to_tensor=True)

def busca_semantica(entrada):
    emb_entrada = modelo_emb.encode(entrada, convert_to_tensor=True)
    similaridades = util.cos_sim(emb_entrada, emb_topicos)
    index = similaridades.argmax().item()
    if similaridades[0][index] > 0.6:
        return respostas[index]
    return None

def responder_usuario(texto):
    contexto = "\n".join([f"Tópico: {t['topico']}\nResposta: {t['resposta']}" for t in dados])
    prompt = f"Baseado nestes tópicos e respostas:\n{contexto}\n\nUsuário: {texto}\nIA:"
    resposta_gerada = modelo.generate_text(prompt)
    return resposta_gerada.text

# 5️⃣ Teste
entrada_usuario = "como eu faço para instalar python?"
print(responder_usuario(entrada_usuario))

if __name__ == "__main__":
    print(busca_semantica(entrada_usuario))