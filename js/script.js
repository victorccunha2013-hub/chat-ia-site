document.addEventListener("DOMContentLoaded", () => {
  console.log("JS carregado com sucesso");

  const messages = document.getElementById("messages");
  const input = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  if (!messages || !input || !sendBtn) {
    console.error("Elementos não encontrados no DOM");
    return;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "message user";
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function typeAIMessage(text) {
    const div = document.createElement("div");
    div.className = "message ai";
    messages.appendChild(div);

    let i = 0;
    const interval = setInterval(() => {
      div.textContent += text[i];
      i++;
      messages.scrollTop = messages.scrollHeight;
      if (i >= text.length) clearInterval(interval);
    }, 20);
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = "";

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      typeAIMessage(data.reply);
    } catch {
      typeAIMessage("⚠️ Erro ao conectar com o servidor.");
    }
  }
});
