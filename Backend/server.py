from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from email_validator import validate_email, EmailNotValidError
from itsdangerous import URLSafeTimedSerializer
import smtplib, ssl
from email.message import EmailMessage
import os
import hashlib
import traceback

app = Flask(__name__)
CORS(app)

print("🔹 Iniciando ChatScript Backend")

# ================= CONFIG =================
EMAIL = os.environ.get("EMAIL")
EMAIL_PASS = os.environ.get("EMAIL_PASS")
SECRET_KEY = os.environ.get("SECRET_KEY", "DEV_SECRET")

print("📌 EMAIL:", EMAIL)
print("📌 EMAIL_PASS existe?", "SIM" if EMAIL_PASS else "NÃO")

app.config["SECRET_KEY"] = SECRET_KEY
serializer = URLSafeTimedSerializer(SECRET_KEY)

# ================= DATABASE =================
conn = sqlite3.connect("db.sqlite", check_same_thread=False)
c = conn.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    confirmed INTEGER DEFAULT 0
)
""")
conn.commit()

print("🗄️ Banco de dados pronto")

# ================= EMAIL =================
def send_confirmation_email(to_email, token):
    print("\n🚀 INICIANDO ENVIO DE EMAIL")
    print("➡️ Destinatário:", to_email)

    link = f"https://chatbr.onrender.com/confirm/{token}"

    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta ChatScript"
    msg["From"] = EMAIL
    msg["To"] = to_email
    msg.set_content(
        f"Olá!\n\nClique no link abaixo para confirmar sua conta:\n{link}\n\nChatScript"
    )

    try:
        print("🔐 Conectando ao SMTP...")
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
            print("🔑 Tentando login no Gmail...")
            smtp.login(EMAIL, EMAIL_PASS)
            print("✅ Login SMTP OK")

            smtp.send_message(msg)
            print("📨 EMAIL ENVIADO COM SUCESSO")

    except Exception as e:
        print("❌ ERRO AO ENVIAR EMAIL")
        traceback.print_exc()

# ================= ROUTES =================
@app.route("/")
def home():
    return "✅ ChatScript Backend rodando"

@app.route("/register", methods=["POST"])
def register():
    print("\n📝 NOVO REGISTRO RECEBIDO")
    data = request.json
    email = data.get("email")
    password = data.get("password")

    print("➡️ Email recebido:", email)

    try:
        email = validate_email(email).email
        print("✅ Email válido")
    except EmailNotValidError as e:
        print("❌ Email inválido")
        return jsonify({"error": str(e)}), 400

    hashed = hashlib.sha256(password.encode()).hexdigest()

    c.execute("SELECT confirmed FROM users WHERE email = ?", (email,))
    user = c.fetchone()

    token = serializer.dumps(email, salt="email-confirm")

    if user:
        print("⚠️ Usuário já existe")
        if user[0] == 0:
            print("🔁 Reenviando email de confirmação")
            send_confirmation_email(email, token)
            return jsonify({"message": "Email de confirmação reenviado"})
        else:
            return jsonify({"error": "Conta já confirmada"}), 400

    print("➕ Criando novo usuário")
    c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed))
    conn.commit()

    send_confirmation_email(email, token)
    return jsonify({"message": "Conta criada. Verifique seu email"})

@app.route("/confirm/<token>")
def confirm(token):
    try:
        email = serializer.loads(token, salt="email-confirm", max_age=3600)
        c.execute("UPDATE users SET confirmed = 1 WHERE email = ?", (email,))
        conn.commit()
        return "✅ Conta confirmada com sucesso! Pode fechar esta aba."
    except Exception as e:
        return f"❌ Link inválido ou expirado: {e}", 400

# ================= START =================
if __name__ == "__main__":
    print("\n🚀 BACKEND INICIADO")
    app.run(debug=True)
