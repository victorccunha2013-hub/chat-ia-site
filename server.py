from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# banco fake em memória
users = {}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    msg = data.get("message", "")
    return jsonify({"reply": msg})

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"]
    password = data["password"]

    if email in users:
        return jsonify({"ok": False, "error": "Usuário já existe"})

    users[email] = password
    return jsonify({"ok": True})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    if users.get(email) == password:
        return jsonify({"ok": True})
    return jsonify({"ok": False})

if __name__ == "__main__":
    app.run(debug=True)
