import bcrypt
import secrets
import smtplib
from email.message import EmailMessage
import os

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed)

def generate_token():
    return secrets.token_urlsafe(32)

def send_confirmation_email(to_email, token):
    site_url = os.getenv("SITE_URL")

    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta - ChatScript"
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to_email

    msg.set_content(f"""
Olá!

Clique no link abaixo para confirmar sua conta no ChatScript:

{site_url}/confirm?token={token}

Se você não criou esta conta, ignore este email.
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        smtp.send_message(msg)
