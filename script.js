document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("message");
  const button = document.getElementById("sendBtn");

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("message", type);
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.id = "typing";
    div.classList.add("message", "bot", "typing");

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      div.appendChild(dot);
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById("typing");
    if (typing) typing.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    button.disabled = true;

    showTyping();

    try {
      const response = await fetch("https://chatbr.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      removeTyping();
      addMessage(data.reply || "Sem resposta 😅", "bot");

    } catch (error) {
      removeTyping();
      addMessage("Erro ao conectar 😢", "bot");
      console.error(error);
    }

    button.disabled = false;
  }

  button.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
// Modal login/criar conta
const loginModal = document.getElementById("loginModal");
const createModal = document.getElementById("createModal");
const userCircle = document.querySelector(".user-circle");
const createAccountLink = document.getElementById("createAccountLink");
const backToLogin = document.getElementById("backToLogin");

// Abrir modal login ao clicar no círculo
userCircle.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
});

// Abrir tela criar conta
createAccountLink.addEventListener("click", () => {
  loginModal.classList.add("hidden");
  createModal.classList.remove("hidden");
});

// Voltar para login
backToLogin.addEventListener("click", () => {
  createModal.classList.add("hidden");
  loginModal.classList.remove("hidden");
});
