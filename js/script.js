const API_URL = "https://chatbr.onrender.com";

const input = document.getElementById("input");
const messages = document.getElementById("messages");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  messages.appendChild(div);

  if (type === "bot") {
    let i = 0;
    const interval = setInterval(() => {
      div.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(interval);
      messages.scrollTop = messages.scrollHeight;
    }, 20);
  } else {
    div.textContent = text;
  }

  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    addMessage(data.reply, "bot");

  } catch {
    addMessage("Erro ao conectar com o servidor.", "bot");
  }
}
