from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from utils import system_prompt

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")

    if not message:
        return jsonify({"reply": "Mensagem vazia"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt()},
                {"role": "user", "content": message}
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": "Erro ao conectar com a IA"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
