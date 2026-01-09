import bcrypt
import secrets
import smtplib
from email.mime.text import MIMEText

# -------- SENHA --------
def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def verify_password(password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(password.encode(), hashed)

# -------- TOKEN --------
def generate_token() -> str:
    return secrets.token_urlsafe(32)

# -------- EMAIL (GMAIL) --------
def send_confirmation_email(to_email: str, token: str):
    sender = "SEU_EMAIL@gmail.com"
    password = "SENHA_DE_APP_DO_GMAIL"

    link = f"https://chatbr.onrender.com/confirm/{token}"

    msg = MIMEText(
        f"Confirme sua conta clicando no link:\n\n{link}",
        "plain",
        "utf-8"
    )

    msg["Subject"] = "Confirmação de Conta - ChatScript"
    msg["From"] = sender
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.send_message(msg)
