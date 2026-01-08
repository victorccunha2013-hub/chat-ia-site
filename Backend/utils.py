import sqlite3
import secrets
import smtplib
from email.message import EmailMessage
from werkzeug.security import generate_password_hash, check_password_hash

def get_db():
    return sqlite3.connect("db.sqlite")

def init_db():
    db = get_db()
    c = db.cursor()

    c.execute("""
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

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed):
    return check_password_hash(hashed, password)

def generate_token():
    return secrets.token_urlsafe(32)

def send_confirmation_email(email, token):
    msg = EmailMessage()
    msg["Subject"] = "Confirme sua conta no ChatScript"
    msg["From"] = "ChatScript <noreply@chatscript>"
    msg["To"] = email

    link = f"https://chatbr.onrender.com/confirm/{token}"

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
            os.environ["EMAIL_USER"],
            os.environ["EMAIL_PASS"]
        )
        smtp.send_message(msg)
