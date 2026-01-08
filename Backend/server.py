from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from openai import OpenAI
from utils import hash_password, verify_password, generate_token, send_confirmation_email

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
DB = "Backend/db.sqlite"

def db():
    return sqlite3.connect(DB)

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("message")
    if not msg:
        return jsonify({"reply": "Mensagem vazia"}), 400

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Você é a IA ChatScript, criada por Victor Carvalho Cunha."
            },
            {"role": "user", "content": msg}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"]
    password = hash_password(data["password"])
    token = generate_token()

    con = db()
    cur = con.cursor()
    cur.execute(
        "INSERT INTO users (email, password, token, confirmed) VALUES (?, ?, ?, 0)",
        (email, password, token)
    )
    con.commit()
    con.close()

    send_confirmation_email(email, token)
    return jsonify({"ok": True})

@app.route("/confirm")
def confirm():
    token = request.args.get("token")
    con = db()
    cur = con.cursor()
    cur.execute("UPDATE users SET confirmed=1 WHERE token=?", (token,))
    con.commit()
    con.close()
    return "Conta confirmada! Pode voltar ao ChatScript."

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
