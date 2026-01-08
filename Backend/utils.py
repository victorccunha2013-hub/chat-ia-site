import bcrypt
import secrets
import smtplib
import os
from email.message import EmailMessage

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed)

def generate_token():
    return secrets.token_urlsafe(32)

def send_confirmation_email(to_email, token):
    site_url = os.getenv("SITE_URL")
    email_user = os.getenv("EMAIL_USER")
    email_pass = os.getenv("EMAIL_PASS")

    if not email_user or not email_pass:
        raise Exception("EMAIL_USER ou EMAIL_PASS não configurado")

    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta - ChatScript"
    msg["From"] = email_user
    msg["To"] = to_email

    msg.set_content(f"""
Olá!

Clique no link abaixo para confirmar sua conta no ChatScript:

{site_url}/confirm?token={token}

Se você não criou essa conta, ignore este email.
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(email_user, email_pass)
        smtp.send_message(msg)
