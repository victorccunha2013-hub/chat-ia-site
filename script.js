document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("user-input");
  const messages = document.getElementById("chat-messages");

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // mensagem do usuário
    addMessage(text, "user");
    input.value = "";

    // digitando
    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.textContent = "Digitando...";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch("https://chatbr.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      typing.remove();
      addMessage(data.reply || "Erro na resposta da IA.", "bot");

    } catch (err) {
      typing.remove();
      addMessage("Erro ao conectar com o servidor.", "bot");
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});
