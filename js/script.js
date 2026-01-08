const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    sendMessage();
  }
});

async function sendMessage() {
  const text = input.value;
  input.value = "";

  addMessage(text, "user");

  const botMessage = addMessage("", "bot");

  try {
    const res = await fetch("https://chatbr.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typeText(botMessage, data.reply);
  } catch {
    typeText(botMessage, "Erro ao conectar com o servidor.");
  }
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function typeText(element, text) {
  let i = 0;
  element.textContent = "";

  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      chat.scrollTop = chat.scrollHeight;
      i++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}
