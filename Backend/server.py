from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"reply": "Mensagem inválida."})

    user_message = data["message"]

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Você é uma IA amigável chamada ChatScript."},
                {"role": "user", "content": user_message}
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": "Erro ao conectar com a IA."})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
