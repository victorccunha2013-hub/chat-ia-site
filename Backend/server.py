from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# rota de teste (health)
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

# rota do chat
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"reply": "Mensagem inválida."})

    user_message = data["message"].lower()

    # IA SIMPLES (temporária, mas FUNCIONA)
    if "oi" in user_message:
        reply = "Olá! 👋 Como posso te ajudar?"
    elif "tudo bem" in user_message:
        reply = "Tudo ótimo 😄 E você?"
    else:
        reply = "Ainda estou aprendendo 🤖. Em breve responderei melhor!"

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
