from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from openai import OpenAI
from utils import hash_password, verify_password, send_confirmation_email, generate_token

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
DB = "db.sqlite"

def get_db():
    return sqlite3.connect(DB)

def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            confirmed INTEGER DEFAULT 0,
            token TEXT
        )
    """)
    db.commit()
    db.close()

init_db()

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    token = generate_token()

    try:
        db = get_db()
        db.execute(
            "INSERT INTO users (email, password, token) VALUES (?, ?, ?)",
            (email, hash_password(password), token)
        )
        db.commit()
        send_confirmation_email(email, token)
        return jsonify({"message": "Conta criada! Verifique seu email."})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email já registrado"}), 400
    finally:
        db.close()

@app.route("/confirm/<token>")
def confirm(token):
    db = get_db()
    cur = db.execute(
        "UPDATE users SET confirmed = 1, token = NULL WHERE token = ?",
        (token,)
    )
    db.commit()
    db.close()

    if cur.rowcount == 0:
        return "Link inválido ou expirado"

    return "Conta confirmada com sucesso! Você já pode voltar ao site."

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    user = db.execute(
        "SELECT password, confirmed FROM users WHERE email = ?",
        (email,)
    ).fetchone()
    db.close()

    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 401

    if not user[1]:
        return jsonify({"error": "Confirme seu email antes de entrar"}), 403

    if not verify_password(password, user[0]):
        return jsonify({"error": "Senha incorreta"}), 401

    return jsonify({"message": "Login realizado com sucesso"})

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("message")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Você é a IA ChatScript, criada por Victor Carvalho Cunha."
            },
            {"role": "user", "content": msg}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
