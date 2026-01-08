from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from utils import hash_password, send_confirmation_email, generate_token
from email_validator import validate_email, EmailNotValidError

app = Flask(__name__)
CORS(app)

DB = "db.sqlite"

def get_db():
    return sqlite3.connect(DB)

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

    db = get_db()
    cur = db.cursor()

    try:
        cur.execute(
            "INSERT INTO users (email, password, confirmed, token) VALUES (?, ?, 0, ?)",
            (email, hashed, token)
        )
        db.commit()
    except:
        return jsonify({"error": "Email já registrado"}), 400

    send_confirmation_email(email, token)

    return jsonify({"message": "Conta criada! Verifique seu email para confirmar."})

@app.route("/confirm")
def confirm():
    token = request.args.get("token")

    db = get_db()
    cur = db.cursor()
    cur.execute("UPDATE users SET confirmed=1 WHERE token=?", (token,))
    db.commit()

    return "Conta confirmada com sucesso! Pode voltar ao ChatScript."

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"
