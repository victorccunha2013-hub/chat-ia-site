document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("message");
  const sendBtn = document.getElementById("sendBtn");

  const API = "https://chatbr.onrender.com/chat";

  function addMessage(text, type, animate = false) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    chat.appendChild(div);

    if (animate) {
      let i = 0;
      const interval = setInterval(() => {
        div.textContent += text[i];
        i++;
        chat.scrollTop = chat.scrollHeight;
        if (i >= text.length) clearInterval(interval);
      }, 20);
    } else {
      div.textContent = text;
    }

    chat.scrollTop = chat.scrollHeight;
  }

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

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    })
      .then(res => res.json())
      .then(data => {
        typing.remove();
        addMessage(data.reply, "bot", true);
      })
      .catch(() => {
        typing.remove();
        addMessage("Erro ao conectar com o servidor.", "bot");
      });
  }

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") send();
  });

  sendBtn.onclick = send;

  /* MODAL */
  window.openLogin = () => {
    document.getElementById("loginModal").style.display = "flex";
  };

  window.closeLogin = () => {
    document.getElementById("loginModal").style.display = "none";
  };

  window.toggleRegister = () => {
    const title = document.getElementById("modalTitle");
    title.textContent =
      title.textContent === "Entrar" ? "Criar conta" : "Entrar";
  };
});
