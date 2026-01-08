const API_URL = "https://chatbr.onrender.com/chat";

const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = "message " + className;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    addMessage(data.reply, "bot");

  } catch (err) {
    addMessage("Erro ao conectar com o servidor.", "bot");
  }
}
