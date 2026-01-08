from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from openai import OpenAI
import os, sqlite3

from utils import (
    hash_password,
    verify_password,
    generate_token,
    send_confirmation_email
)

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def db():
    return sqlite3.connect("db.sqlite")

# ---------- INIT DB ----------
with db() as conn:
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        confirmed INTEGER DEFAULT 0,
        token TEXT,
        avatar TEXT
    )
    """)

# ---------- CHAT ----------
@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("message")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é a IA ChatScript, criada por Victor Carvalho Cunha."},
            {"role": "user", "content": msg}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

# ---------- REGISTER ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"]
    password = hash_password(data["password"])
    token = generate_token()
    avatar = email[0].upper()

    try:
        with db() as conn:
            conn.execute(
                "INSERT INTO users (email,password,token,avatar) VALUES (?,?,?,?)",
                (email, password, token, avatar)
            )
        send_confirmation_email(email, token)
        return jsonify({"ok": True})
    except:
        return jsonify({"error": "Email já cadastrado"}), 400

# ---------- CONFIRM ----------
@app.route("/confirm/<token>")
def confirm(token):
    with db() as conn:
        cur = conn.execute("UPDATE users SET confirmed=1 WHERE token=?", (token,))
    return "Conta confirmada! Pode voltar ao site."

# ---------- LOGIN ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    with db() as conn:
        user = conn.execute(
            "SELECT password, confirmed, avatar FROM users WHERE email=?",
            (email,)
        ).fetchone()

    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 400

    if not verify_password(password, user[0]):
        return jsonify({"error": "Senha incorreta"}), 400

    if not user[1]:
        return jsonify({"error": "Confirme seu email"}), 403

    return jsonify({"ok": True, "avatar": user[2]})

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"
