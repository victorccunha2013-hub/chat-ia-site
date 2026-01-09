from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from openai import OpenAI
from utils import (
    hash_password,
    verify_password,
    send_confirmation_email,
    generate_token
)

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# ---------- BANCO ----------
def get_db():
    return sqlite3.connect("Backend/db.sqlite", check_same_thread=False)

db = get_db()
cursor = db.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password BLOB,
    confirmed INTEGER,
    token TEXT
)
""")
db.commit()

# ---------- ROTAS ----------
@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

# ---------- CADASTRO ----------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Dados inválidos"}), 400

    token = generate_token()
    hashed = hash_password(password)

    try:
        cursor.execute(
            "INSERT INTO users (email, password, confirmed, token) VALUES (?, ?, 0, ?)",
            (email, hashed, token)
        )
        db.commit()
        send_confirmation_email(email, token)
        return jsonify({"message": "Conta criada! Confirme no e-mail."})
    except:
        return jsonify({"error": "E-mail já existe"}), 400

# ---------- CONFIRMAÇÃO ----------
@app.route("/confirm/<token>")
def confirm_email(token):
    cursor.execute("SELECT id FROM users WHERE token=?", (token,))
    user = cursor.fetchone()

    if not user:
        return "Token inválido"

    cursor.execute(
        "UPDATE users SET confirmed=1, token=NULL WHERE id=?",
        (user[0],)
    )
    db.commit()
    return "Conta confirmada com sucesso!"

# ---------- LOGIN ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    cursor.execute(
        "SELECT password, confirmed FROM users WHERE email=?",
        (email,)
    )
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 400

    if not verify_password(password, user[0]):
        return jsonify({"error": "Senha incorreta"}), 400

    if user[1] == 0:
        return jsonify({"error": "Confirme seu e-mail"}), 403

    return jsonify({"message": "Login OK"})

# ---------- CHAT ----------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    msg = data.get("message", "")

    if not msg:
        return jsonify({"reply": ""})

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
            {"role": "user", "content": msg}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

# ---------- START ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
