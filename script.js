alert("SCRIPT CARREGADO");
const chat = document.getElementById("chat");

function addMessage(sender, text, type) {
  const msg = document.createElement("div");
  msg.innerText = `${sender}: ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.innerText = "IA está digitando...";
  chat.appendChild(typing);
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

async function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value.trim();

  if (!text) return;

  addMessage("Você", text);
  input.value = "";

  showTyping();

  try {
    const response = await fetch("https://chatbr.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    removeTyping();
    addMessage("IA", data.reply);

  } catch (error) {
    removeTyping();
    addMessage("Erro", "Não foi possível conectar ao servidor");
    console.error(error);
  }
}
