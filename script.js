console.log("ChatScript carregado");

const input = document.getElementById("chatInput");
const messages = document.getElementById("messages");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    addMessage(input.value);
    input.value = "";
  }
});

function addMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.style.marginBottom = "12px";
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}
