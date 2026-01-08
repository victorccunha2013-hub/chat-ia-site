from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import uuid
import smtplib
from email.message import EmailMessage
from werkzeug.security import generate_password_hash, check_password_hash
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

DB_PATH = "Backend/db.sqlite"

EMAIL_USER = os.environ.get("EMAIL_USER")
EMAIL_PASS = os.environ.get("EMAIL_PASS")
SITE_URL = os.environ.get("SITE_URL")

# ---------- DATABASE ----------
def get_db():
    return sqlite3.connect(DB_PATH)

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

# ---------- EMAIL ----------
def send_confirmation_email(email, token):
    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta - ChatScript"
    msg["From"] = EMAIL_USER
    msg["To"] = email

    link = f"{SITE_URL}/confirm/{token}"

    msg.set_content(f"""
Olá!

Clique no link abaixo para confirmar sua conta no ChatScript:

{link}

Se você não criou esta conta, ignore este email.
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_USER, EMAIL_PASS)
        smtp.send_message(msg)

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

    token = str(uuid.uuid4())
    hashed = generate_password_hash(password)

    try:
        db = get_db()
        db.execute(
            "INSERT INTO users (email, password, token) VALUES (?, ?, ?)",
            (email, hashed, token)
        )
        db.commit()
        db.close()

        send_confirmation_email(email, token)

        return jsonify({"success": True, "message": "Email de confirmação enviado"})

    except Exception as e:
        return jsonify({"error": "Email já registrado"}), 400

@app.route("/confirm/<token>")
def confirm_email(token):
    db = get_db()
    cur = db.execute(
        "SELECT id FROM users WHERE token = ?", (token,)
    )
    user = cur.fetchone()

    if not user:
        return "Token inválido", 400

    db.execute(
        "UPDATE users SET confirmed = 1, token = NULL WHERE id = ?",
        (user[0],)
    )
    db.commit()
    db.close()

    return "Conta confirmada com sucesso! Você já pode fechar esta página."

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cur = db.execute(
        "SELECT password, confirmed FROM users WHERE email = ?",
        (email,)
    )
    user = cur.fetchone()
    db.close()

    if not user:
        return jsonify({"error": "Login inválido"}), 401

    if not user[1]:
        return jsonify({"error": "Confirme seu email primeiro"}), 403

    if not check_password_hash(user[0], password):
        return jsonify({"error": "Senha incorreta"}), 401

    return jsonify({"success": True})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Você é a IA ChatScript. "
                    "Você foi criada por Victor Carvalho Cunha."
                )
            },
            {"role": "user", "content": message}
        ]
    )

    reply = response.choices[0].message.content
    return jsonify({"reply": reply})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
