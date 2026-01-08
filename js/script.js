const API_URL = "https://chatbr.onrender.com/chat";

const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = "message " + className;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function typeWriter(element, text, speed = 20) {
  element.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    messages.scrollTop = messages.scrollHeight;

    if (i >= text.length) clearInterval(interval);
  }, speed);
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const botDiv = addMessage("...", "bot");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    typeWriter(botDiv, data.reply);

  } catch (err) {
    botDiv.textContent = "Erro ao conectar com o servidor.";
  }
}
