const chat = document.getElementById("chat");
const input = document.getElementById("message");
const modal = document.getElementById("loginModal");

const API = "https://chatbr.onrender.com";

/* ENTER */
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  chat.appendChild(div);

  let i = 0;
  function typeEffect() {
    if (i < text.length) {
      div.textContent += text[i++];
      chat.scrollTop = chat.scrollHeight;
      setTimeout(typeEffect, 18);
    }
  }
  typeEffect();
}

function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "msg";
  typing.textContent = "ChatScript está digitando...";
  chat.appendChild(typing);

  fetch(API + "/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: text })
  })
  .then(r => r.json())
  .then(d => {
    typing.remove();
    addMessage(d.reply, "bot");
  })
  .catch(() => {
    typing.remove();
    addMessage("Erro ao conectar com o servidor.", "bot");
  });
}

/* LOGIN */
function openLogin() {
  modal.style.display = "flex";
}

function closeLogin() {
  modal.style.display = "none";
}

function toggleRegister() {
  alert("Cadastro entra depois (backend)");
}
