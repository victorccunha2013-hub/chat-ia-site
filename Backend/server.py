from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from openai import OpenAI
from utils import hash_password, verify_password

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
DB = "db.sqlite"

# ---------- DB ----------
def get_db():
    return sqlite3.connect(DB)

def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)
    db.commit()
    db.close()

init_db()

# ---------- ROTAS ----------
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

    try:
        db = get_db()
        db.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, hash_password(password))
        )
        db.commit()
        return jsonify({"message": "Conta criada com sucesso"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email já registrado"}), 400
    finally:
        db.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    user = db.execute(
        "SELECT password FROM users WHERE email = ?",
        (email,)
    ).fetchone()
    db.close()

    if not user or not verify_password(password, user[0]):
        return jsonify({"error": "Email ou senha inválidos"}), 401

    return jsonify({"message": "Login realizado com sucesso", "email": email})

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
