import hashlib
import secrets
import sqlite3
import requests
import os

DB_PATH = "Backend/db.sqlite"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    return hash_password(password) == hashed

def generate_token():
    return secrets.token_urlsafe(32)

def send_confirmation_email(email, token):
    api_key = os.getenv("RESEND_API_KEY")
    base_url = os.getenv("BASE_URL")

    confirm_link = f"{base_url}/confirmar?token={token}"

    payload = {
        "from": "ChatScript <onboarding@resend.dev>",
        "to": [email],
        "subject": "Confirme sua conta no ChatScript",
        "html": f"""
        <h2>Bem-vindo ao ChatScript 🚀</h2>
        <p>Clique no botão abaixo para confirmar sua conta:</p>
        <a href="{confirm_link}"
           style="padding:12px 20px;background:#7c3aed;color:#fff;
           text-decoration:none;border-radius:8px;display:inline-block;">
           Confirmar conta
        </a>
        """
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    requests.post("https://api.resend.com/emails", json=payload, headers=headers)
