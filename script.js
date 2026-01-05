console.log("ChatScript carregado");

const input = document.getElementById("chatInput");
const messages = document.getElementById("messages");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    const userText = input.value;
    addMessage(userText, "user");
    input.value = "";

    // resposta fake da IA (por enquanto)
    setTimeout(() => {
      addMessage("Resposta da IA em breve 🤖", "ai");
    }, 600);
  }
});

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}
