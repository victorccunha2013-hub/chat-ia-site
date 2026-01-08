const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const modal = document.getElementById("authModal");
const title = document.getElementById("modalTitle");

let mode = "login";

// CHAT
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  fetch("https://chatbr.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => typeBot(data.reply))
    .catch(() => typeBot("Erro ao conectar com o servidor."));
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function typeBot(text) {
  const div = document.createElement("div");
  div.className = "msg bot";
  chat.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.textContent += text[i];
    i++;
    chat.scrollTop = chat.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}

// MODAL
function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function switchMode() {
  mode = mode === "login" ? "register" : "login";
  title.innerText = mode === "login" ? "Entrar" : "Criar conta";
}

function submitAuth() {
  fetch(`https://chatbr.onrender.com/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
    .then(res => res.json())
    .then(data => alert(data.message || data.error))
    .catch(() => alert("Erro ao conectar com o servidor"));
}
