from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from utils import init_db, create_user, check_user

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

init_db()

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    if check_user(data["email"], data["password"]):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    try:
        create_user(data["email"], data["password"])
        return jsonify({"success": True})
    except:
        return jsonify({"success": False}), 400

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Você é a IA ChatScript. "
                    "Você foi criada por Victor Carvalho Cunha. "
                    "Se perguntarem quem te criou, responda isso."
                )
            },
            {"role": "user", "content": user_message}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
