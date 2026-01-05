from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI

# ======================================
# CARREGA VARIÁVEIS DO .env
# ======================================
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("❌ OPENAI_API_KEY não encontrada. Verifique o arquivo .env")

# ======================================
# INICIALIZA APP
# ======================================
app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=OPENAI_API_KEY)

print("✅ OPENAI_API_KEY carregada")
print("🚀 Backend ChatScript iniciando...")

# ======================================
# ROTA PRINCIPAL DE CHAT
# ======================================
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "Mensagem vazia"}), 400

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Você é o ChatScript, um assistente inteligente, amigável e responde sempre em português."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.7
        )

        reply = response.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ ERRO:", e)
        return jsonify({"error": "Erro ao gerar resposta da IA"}), 500


# ======================================
# ROTA DE TESTE (OPCIONAL)
# ======================================
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ChatScript backend online 🚀"})


# ======================================
# START
# ======================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
