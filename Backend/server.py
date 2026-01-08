from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from utils import hash_password, verify_password, send_confirmation_email, generate_token
from email_validator import validate_email, EmailNotValidError
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
DB = "db.sqlite"

def db():
    return sqlite3.connect(DB)

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify({"error": "Email inválido"}), 400

    token = generate_token()
    hashed = hash_password(password)

    try:
        c = db().cursor()
        c.execute(
            "INSERT INTO users (email, password, confirmed, token) VALUES (?, ?, 0, ?)",
            (email, hashed, token)
        )
        c.connection.commit()
    except:
        return jsonify({"error": "Email já registrado"}), 400

    send_confirmation_email(email, token)
    return jsonify({"message": "Conta criada! Verifique seu email."})

@app.route("/confirm")
def confirm():
    token = request.args.get("token")
    c = db().cursor()
    c.execute("UPDATE users SET confirmed=1 WHERE token=?", (token,))
    c.connection.commit()
    return "Conta confirmada! Pode voltar ao ChatScript."

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("message")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role":"system","content":"Você é a IA ChatScript criada por Victor Carvalho Cunha."},
            {"role":"user","content":msg}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})
