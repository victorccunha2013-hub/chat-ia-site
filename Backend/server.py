from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import os
from openai import OpenAI
from utils import (
    init_db,
    get_db,
    hash_password,
    verify_password,
    generate_token,
    send_confirmation_email
)

app = Flask(__name__)
CORS(app)
init_db()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Dados inválidos"}), 400

    token = generate_token()
    db = get_db()
    c = db.cursor()

    try:
        c.execute(
            "INSERT INTO users (email, password, token) VALUES (?, ?, ?)",
            (email, hash_password(password), token)
        )
        db.commit()
        send_confirmation_email(email, token)
        return jsonify({"success": True})
    except:
        return jsonify({"error": "Email já registrado"}), 400
    finally:
        db.close()

@app.route("/confirm/<token>")
def confirm_email(token):
    db = get_db()
    c = db.cursor()

    c.execute(
        "UPDATE users SET confirmed = 1 WHERE token = ?",
        (token,)
    )
    db.commit()
    db.close()

    return redirect("https://victorccunha2013-hub.github.io/chat-ia-site/")

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    c = db.cursor()
    c.execute(
        "SELECT password, confirmed FROM users WHERE email = ?",
        (email,)
    )
    user = c.fetchone()
    db.close()

    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 401

    if not user[1]:
        return jsonify({"error": "Confirme seu email primeiro"}), 403

    if not verify_password(password, user[0]):
        return jsonify({"error": "Senha incorreta"}), 401

    return jsonify({"success": True})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")

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
            {"role": "user", "content": message}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
