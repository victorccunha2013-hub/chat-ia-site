console.log("ChatScript carregado");

const input = document.getElementById("chatInput");
const messages = document.getElementById("messages");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    const userText = input.value.trim();

    // mensagem do usuário (direita)
    addMessage(userText, "user");

    input.value = "";

    // IA digitando
    showTypingIndicator();

    // resposta da IA (fake por enquanto)
    setTimeout(() => {
      removeTypingIndicator();
      typeAIMessage("Essa é uma resposta com animação de digitação 🤖");
    }, 800);
  }
});

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// indicador "digitando..."
function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("message", "ai");
  typing.id = "typing";
  typing.textContent = "Digitando...";
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// animação letra por letra
function typeAIMessage(text) {
  const msg = document.createElement("div");
  msg.classList.add("message", "ai");
  messages.appendChild(msg);

  let i = 0;
  const interval = setInterval(() => {
    msg.textContent += text.charAt(i);
    i++;
    messages.scrollTop = messages.scrollHeight;

    if (i >= text.length) {
      clearInterval(interval);
    }
  }, 30);
}
