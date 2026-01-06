const input = document.getElementById("input");
const messages = document.getElementById("messages");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.textContent = "Digitando...";
    messages.appendChild(typing);

    try {
      const res = await fetch("https://chatbr.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      typing.remove();
      addMessage(data.reply || "Erro na resposta da IA", "bot");

    } catch {
      typing.remove();
      addMessage("Erro ao conectar ao servidor.", "bot");
    }
  }
});
