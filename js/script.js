const API_URL = "https://chatbr.onrender.com/chat";

const input = document.getElementById("userInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function createMessage(className) {
  const div = document.createElement("div");
  div.className = "message " + className;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function typeWriter(element, text, speed = 25) {
  let i = 0;
  element.textContent = "";

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      messages.scrollTop = messages.scrollHeight;
      setTimeout(typing, speed);
    }
  }
  typing();
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  const userDiv = createMessage("user");
  userDiv.textContent = text;
  input.value = "";

  const botDiv = createMessage("bot");
  botDiv.textContent = "Digitando...";

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
