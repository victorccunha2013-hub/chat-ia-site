from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"reply": "Mensagem vazia recebida."})

    # resposta temporária
    return jsonify({
        "reply": "🤖 Ainda estou aprendendo... Em breve responderei melhor!"
    })

if __name__ == "__main__":
    app.run(debug=True)
