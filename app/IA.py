from app import app
import json
from difflib import get_close_matches
from sentence_transformers import SentenceTransformer, util
from langchain.llms import HuggingFacePipeline
from transformers import pipeline

# 1️⃣ Carregar o JSON
with open("respostas.json", "r", encoding="utf-8") as f:
    dados = json.load(f)

topicos = [item["topico"] for item in dados]


modelo_emb = SentenceTransformer('all-MiniLM-L6-v2')
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

# 3️⃣ Configurar LLM para fallback
llm_pipeline = pipeline(
    "text-generation",
    model="meta-llama/Llama-2-7b-hf",  # modelo LLaMA-2 7B
    max_new_tokens=200,
    device_map="auto",  # detecta CPU/GPU automaticamente
    torch_dtype="auto"  # ajusta tipo de dados para reduzir memória
)
llm = HuggingFacePipeline(pipeline=llm_pipeline)


# 4️⃣ Função principal
def responder_usuario(texto):
    resposta = busca_json(texto)
    if resposta:
        return resposta
    else:
        # fallback generativo baseado nos tópicos do JSON
        contexto = "\n".join([f"Tópico: {t['topico']}\nResposta: {t['resposta']}" for t in dados])
        prompt = f"Baseado nestes tópicos e respostas:\n{contexto}\n\nUsuário: {texto}\nIA:"
        resposta_gerada = llm(prompt)
        return resposta_gerada

# 5️⃣ Teste
entrada_usuario = "como eu faço para instalar python?"
print(responder_usuario(entrada_usuario))

