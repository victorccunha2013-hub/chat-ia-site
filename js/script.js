const input = document.getElementById("input");
const messages = document.getElementById("messages");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  if (sender === "bot") {
    typeText(div, text);
  } else {
    div.textContent = text;
  }
}

// animação letra por letra
function typeText(element, text) {
  let i = 0;
  element.textContent = "";

  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    messages.scrollTop = messages.scrollHeight;

    if (i >= text.length) {
      clearInterval(interval);
    }
  }, 25); // velocidade (ms)
}

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    // indicador de digitação
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
});
