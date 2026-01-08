const API = "https://chatbr.onrender.com";
let isRegister = false;

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const botMsg = addMessage("", "bot");

  try {
    const res = await fetch(API + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typeWriter(botMsg, data.reply);
  } catch {
    typeWriter(botMsg, "Erro ao conectar com o servidor.");
  }
}

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerText = text;
  document.getElementById("messages").appendChild(msg);
  msg.scrollIntoView();
  return msg;
}

/* ANIMAÇÃO DIGITANDO */
function typeWriter(element, text, i = 0) {
  if (i < text.length) {
    element.innerText += text.charAt(i);
    setTimeout(() => typeWriter(element, text, i + 1), 20);
  }
}

/* LOGIN MODAL */
function openModal() {
  document.getElementById("modal").style.display = "block";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}
function toggleMode() {
  isRegister = !isRegister;
  document.getElementById("modalTitle").innerText =
    isRegister ? "Criar conta" : "Entrar";
  document.getElementById("toggle").innerHTML =
    isRegister
      ? "Já tem conta? <span>Entrar</span>"
      : "Não tem uma conta? <span>Criar agora</span>";
}
