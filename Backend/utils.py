import bcrypt
import secrets
import smtplib
from email.mime.text import MIMEText

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def generate_token():
    return secrets.token_urlsafe(32)

def send_confirmation_email(email, token):
    sender = "SEU_EMAIL@gmail.com"
    password = "SENHA_DE_APP_GMAIL"

    link = f"https://chatbr.onrender.com/confirm?token={token}"

    msg = MIMEText(f"Confirme sua conta clicando no link:\n\n{link}")
    msg["Subject"] = "Confirmação de Conta - ChatScript"
    msg["From"] = sender
    msg["To"] = email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.send_message(msg)
