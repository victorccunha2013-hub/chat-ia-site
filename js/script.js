const chat = document.getElementById("chat");
const input = document.getElementById("message");
const API = "https://chatbr.onrender.com";

/* ENTER FUNCIONA */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    send();
  }
});

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  chat.appendChild(div);

  let i = 0;
  function typeEffect() {
    if (i < text.length) {
      div.textContent += text.charAt(i);
      i++;
      chat.scrollTop = chat.scrollHeight;
      setTimeout(typeEffect, 18);
    }
  }
  typeEffect();
}

function send() {
  const text = input.value.trim();
  if (!text) return;

  /* mensagem do usuário */
  addMessage(text, "user");
  input.value = "";

  /* indicador digitando */
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

    /* SOMENTE a resposta da IA */
    addMessage(data.reply, "bot");
  })
  .catch(() => {
    typing.remove();
    addMessage("⚠️ Erro ao conectar com o servidor.", "bot");
  });
}
