const input = document.getElementById("user-input");
const messages = document.getElementById("messages");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addBotMessageAnimated(text) {
  const div = document.createElement("div");
  div.className = "message bot";
  messages.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.textContent += text.charAt(i);
    i++;
    messages.scrollTop = messages.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 30);
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    const reply =
      data.reply ||
      "🤖 Ainda estou aprendendo... Em breve responderei melhor!";

    addBotMessageAnimated(reply);

  } catch (error) {
    console.error(error);
    addBotMessageAnimated(
      "⚠️ Não consegui me conectar ao servidor."
    );
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
