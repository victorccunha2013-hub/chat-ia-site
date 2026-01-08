import sqlite3
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
import smtplib
from email.message import EmailMessage
import os

DB = "db.sqlite"

def get_db():
    return sqlite3.connect(DB)

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed):
    return check_password_hash(hashed, password)

def generate_token():
    return secrets.token_urlsafe(32)

def send_confirmation_email(email, token):
    link = f"https://chatbr.onrender.com/confirm/{token}"

    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta - ChatScript"
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = email
    msg.set_content(f"""
Olá!

Clique no link abaixo para confirmar sua conta no ChatScript:

{link}

Se você não criou essa conta, ignore este email.
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        smtp.send_message(msg)
