import os
from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    if not message:
        return jsonify({"reply": "Mensagem vazia."})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Você é o ChatScript. "
                    "Se perguntarem quem te criou, responda: Victor Carvalho Cunha."
                )
            },
            {"role": "user", "content": message}
        ]
    )

    return jsonify({
        "reply": response.choices[0].message.content
    })

if __name__ == "__main__":
    app.run(debug=True)
