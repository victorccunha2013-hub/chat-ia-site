from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from utils import hash_password, verify_password, send_confirmation_email, generate_token

app = Flask(__name__)
CORS(app)

DB_PATH = "/tmp/database.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# cria tabelas
conn = get_db()
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    token TEXT,
    verified INTEGER DEFAULT 0
)
""")
conn.commit()
conn.close()

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    token = generate_token()
    hashed = hash_password(password)

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password, token) VALUES (?, ?, ?)",
            (email, hashed, token)
        )
        conn.commit()
        conn.close()

        send_confirmation_email(email, token)
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/confirm")
def confirm():
    token = request.args.get("token")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET verified = 1 WHERE token = ?",
        (token,)
    )
    conn.commit()
    conn.close()
    return "Conta confirmada com sucesso!"

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 400

    if not user["verified"]:
        return jsonify({"error": "Conta não confirmada"}), 400

    if not verify_password(password, user["password"]):
        return jsonify({"error": "Senha incorreta"}), 400

    return jsonify({"success": True})

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("message")
    return jsonify({"reply": f"ChatScript respondeu: {msg}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
