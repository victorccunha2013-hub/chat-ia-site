from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from utils import init_db, hash_password, verify_password, get_db

app = Flask(__name__)
CORS(app)

init_db()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.route("/")
def home():
    return "ChatScript backend rodando 🚀"

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Dados inválidos"}), 400

    db = get_db()
    c = db.cursor()

    try:
        c.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, hash_password(password))
        )
        db.commit()
        return jsonify({"success": True})
    except:
        return jsonify({"error": "Email já cadastrado"}), 400
    finally:
        db.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    c = db.cursor()
    c.execute("SELECT password FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    db.close()

    if not user or not verify_password(password, user[0]):
        return jsonify({"error": "Login inválido"}), 401

    return jsonify({"success": True, "email": email})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Você é a IA ChatScript criada por Victor Carvalho Cunha."
            },
            {"role": "user", "content": message}
        ]
    )

    return jsonify({"reply": response.choices[0].message.content})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
