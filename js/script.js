const API = "https://chatbr.onrender.com";

const chat = document.getElementById("chat");
const input = document.getElementById("msg");

document.getElementById("sendBtn").onclick = send;
input.addEventListener("keydown", e => e.key === "Enter" && send());

function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function typeText(el, text) {
  let i = 0;
  el.textContent = "";
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
    chat.scrollTop = chat.scrollHeight;
  }, 20);
}

function send() {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  addMsg(text, "user");

  const typing = addMsg("ChatScript está digitando…", "bot");

  fetch(API + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(r => r.json())
    .then(d => {
      typing.remove();
      const bot = addMsg("", "bot");
      typeText(bot, d.reply);
    })
    .catch(() => {
      typing.textContent = "Erro ao conectar ao servidor.";
    });
}

/* MODAL */
const modal = document.getElementById("loginModal");
document.getElementById("openLogin").onclick = () => modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
