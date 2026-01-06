import os
import sqlite3
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from openai import OpenAI

app = Flask(__name__)

# ===================== BANCO DE DADOS =====================
def get_db():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    return conn

with get_db() as db:
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

# ===================== OPENAI =====================
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# ===================== REGISTRO =====================
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    hashed_password = generate_password_hash(password)

    try:
        with get_db() as db:
            db.execute(
                "INSERT INTO users (email, password) VALUES (?, ?)",
                (email, hashed_password)
            )
        return jsonify({"message": "Conta criada com sucesso"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email já registrado"}), 409


# ===================== LOGIN =====================
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    with get_db() as db:
        user = db.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ).fetchone()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Email ou senha inválidos"}), 401

    return jsonify({
        "message": "Login realizado com sucesso",
        "email": user["email"]
    })


# ===================== CHAT =====================
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"reply": "Mensagem vazia."})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Você é o ChatScript, um assistente moderno. "
                    "Se alguém perguntar quem te criou, quem é seu criador "
                    "ou quem fez você, responda exatamente: "
                    "'Victor Carvalho Cunha'."
                )
            },
            {"role": "user", "content": user_message}
        ]
    )

    return jsonify({
        "reply": response.choices[0].message.content
    })


# ===================== START =====================
if __name__ == "__main__":
    app.run(debug=True)
