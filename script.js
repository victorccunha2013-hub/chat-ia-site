const chatMessages = document.getElementById("chat-messages");
const input = document.getElementById("user-input");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Mensagem do usuário
  addMessage(text, "user");
  input.value = "";

  // Indicador de digitação
  const typing = document.createElement("div");
  typing.classList.add("message", "bot");
  typing.textContent = "Digitando...";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("https://chatbr.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    typing.remove();

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("Erro: resposta inválida da IA.", "bot");
    }

  } catch (error) {
    typing.remove();
    addMessage("Erro ao conectar com o servidor.", "bot");
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
