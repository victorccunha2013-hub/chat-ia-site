const chat = document.getElementById("chat");
const input = document.getElementById("message");
const modal = document.getElementById("loginModal");

const API = "https://chatbr.onrender.com";

/* ENTER FUNCIONA */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    send();
  }
});

/* ADICIONA MENSAGEM */
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  chat.appendChild(div);

  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      div.textContent += text[i];
      i++;
      chat.scrollTop = chat.scrollHeight;
      setTimeout(typeWriter, 18);
    }
  }

  typeWriter();
}

/* ENVIA MENSAGEM */
function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "msg bot";
  typing.textContent = "ChatScript está digitando...";
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  fetch(API + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => {
      typing.remove();
      addMessage(data.reply, "bot"); // 👈 SEM PREFIXO
    })
    .catch(() => {
      typing.remove();
      addMessage("Erro ao conectar com o servidor.", "bot");
    });
}

/* LOGIN MODAL */
function openLogin() {
  modal.style.display = "flex";
}

function closeLogin() {
  modal.style.display = "none";
}
