import bcrypt
import secrets
import smtplib
from email.message import EmailMessage
import os

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

def generate_token():
    return secrets.token_urlsafe(32)

def send_confirmation_email(to_email, token):
    link = f"https://chatbr.onrender.com/confirm?token={token}"

    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta no ChatScript"
    msg["From"] = os.environ.get("EMAIL_USER")
    msg["To"] = to_email
    msg.set_content(
        f"""
Olá!

Clique no link abaixo para confirmar sua conta no ChatScript:

{link}

Se você não criou essa conta, ignore este email.
"""
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(
            os.environ.get("EMAIL_USER"),
            os.environ.get("EMAIL_PASS")
        )
        smtp.send_message(msg)
