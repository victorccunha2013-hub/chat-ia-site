import smtplib
from email.message import EmailMessage
import os
import uuid
import hashlib

# =========================
# SENHAS
# =========================

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    return hash_password(password) == hashed

# =========================
# TOKEN
# =========================

def generate_token():
    return str(uuid.uuid4())

# =========================
# EMAIL
# =========================

def send_confirmation_email(to_email, token):
    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta no ChatScript"
    msg["From"] = os.environ.get("EMAIL_USER")
    msg["To"] = to_email

    link = f"{os.environ.get('SITE_URL')}/confirm/{token}"

    msg.set_content(
        f"Olá!\n\n"
        f"Clique no link abaixo para confirmar sua conta:\n\n"
        f"{link}\n\n"
        f"ChatScript"
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(
            os.environ.get("EMAIL_USER"),
            os.environ.get("EMAIL_PASS")
        )
        smtp.send_message(msg)
