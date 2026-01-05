const input = document.getElementById("chatInput");
const messages = document.getElementById("messages");

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    const userText = input.value.trim();
    addMessage(userText, "user");
    input.value = "";

    showTypingIndicator();

    try {
      const res = await fetch("https://chatbr.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();
      removeTypingIndicator();
      typeAIMessage(data.reply);
    } catch (err) {
      removeTypingIndicator();
      typeAIMessage("Erro ao conectar com a IA 😢");
    }
  }
});

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message ai";
  typing.textContent = "Digitando...";
  messages.appendChild(typing);
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function typeAIMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message ai";
  messages.appendChild(msg);

  let i = 0;
  const interval = setInterval(() => {
    msg.textContent += text.charAt(i);
    i++;
    messages.scrollTop = messages.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 25);
}
