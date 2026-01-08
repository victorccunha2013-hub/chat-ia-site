from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import sqlite3
import os

from openai import OpenAI
from utils import (
    hash_password,
    verify_password,
    generate_token,
    send_confirmation_email
)

app = Flask(__name__)
CORS(app)

DB_PATH = "Backend/db.sqlite"

# Cliente OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def connect_db():
    return sqlite3.connect(DB_PATH)


@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"


# =========================
# CHAT (IA REAL)
# =========================
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message")

    if not user_message:
        return jsonify({"reply": "Mensagem vazia"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é a IA ChatScript. "
                        "Você foi criada por Victor Carvalho Cunha. "
                        "Se perguntarem quem te criou, responda exatamente isso. "
                        "Responda sempre de forma clara, educada e bem formatada."
                    )
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": "⚠️ Erro ao conectar com a IA."}), 500


# =========================
# REGISTRO
# =========================
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Dados inválidos"}), 400

    hashed = hash_password(password)
    token = generate_token()

    db = connect_db()
    cur = db.cursor()

    try:
        cur.execute(
            "INSERT INTO users (email, password, confirmed, token) VALUES (?, ?, 0, ?)",
            (email, hashed, token)
        )
        db.commit()
        send_confirmation_email(email, token)
        return jsonify({"msg": "Conta criada. Verifique seu e-mail."})
    except sqlite3.IntegrityError:
        return jsonify({"msg": "E-mail já registrado"}), 400


@app.route("/confirmar")
def confirmar():
    token = request.args.get("token")

    if not token:
        return "Token inválido", 400

    db = connect_db()
    cur = db.cursor()
    cur.execute("UPDATE users SET confirmed = 1 WHERE token = ?", (token,))
    db.commit()

    return redirect("/")


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = connect_db()
    cur = db.cursor()
    cur.execute(
        "SELECT password, confirmed FROM users WHERE email = ?",
        (email,)
    )
    user = cur.fetchone()

    if not user:
        return jsonify({"msg": "Usuário não encontrado"}), 404

    if user[1] == 0:
        return jsonify({"msg": "Confirme seu e-mail"}), 403

    if verify_password(password, user[0]):
        return jsonify({"msg": "Login realizado"})
    else:
        return jsonify({"msg": "Senha incorreta"}), 401


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
