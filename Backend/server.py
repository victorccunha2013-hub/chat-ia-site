from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os, random, smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)

USERS_FILE = "users.json"

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USER = os.environ.get("EMAIL_USER")
EMAIL_PASS = os.environ.get("EMAIL_PASS")


def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)


def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)


def send_code(email, code):
    msg = MIMEText(f"Seu código de confirmação é: {code}")
    msg["Subject"] = "Confirmação ChatScript"
    msg["From"] = EMAIL_USER
    msg["To"] = email

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    users = load_users()

    if email in users:
        return jsonify({"error": "Usuário já existe"}), 400

    code = str(random.randint(100000, 999999))

    users[email] = {
        "password": password,
        "confirmed": False,
        "code": code
    }

    save_users(users)
    send_code(email, code)

    return jsonify({"message": "Código enviado para o email"})


@app.route("/confirm", methods=["POST"])
def confirm():
    data = request.json
    email = data.get("email")
    code = data.get("code")

    users = load_users()

    if email not in users:
        return jsonify({"error": "Usuário não encontrado"}), 404

    if users[email]["code"] != code:
        return jsonify({"error": "Código inválido"}), 400

    users[email]["confirmed"] = True
    users[email]["code"] = None
    save_users(users)

    return jsonify({"message": "Conta confirmada com sucesso"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    users = load_users()

    if email not in users or users[email]["password"] != password:
        return jsonify({"error": "Email ou senha inválidos"}), 401

    if not users[email]["confirmed"]:
        return jsonify({"error": "Conta não confirmada"}), 403

    return jsonify({"message": "Login realizado com sucesso"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
