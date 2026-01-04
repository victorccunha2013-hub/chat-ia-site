from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # permite o frontend acessar o backend

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    mensagem = data["mensagem"]

    # resposta simples (ainda não é IA)
    resposta = f"Servidor recebeu: {mensagem}"

    return jsonify({"resposta": resposta})

if __name__ == "__main__":
    app.run(debug=True)
