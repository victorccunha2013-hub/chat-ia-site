const chat = document.getElementById("chat");
const input = document.getElementById("input");
const modal = document.getElementById("modal");

document.getElementById("userIcon").onclick = () => {
  modal.style.display = "flex";
};

function closeModal() {
  modal.style.display = "none";
}

function toggleMode() {
  const title = document.getElementById("modalTitle");
  title.innerText =
    title.innerText === "Login" ? "Criar Conta" : "Login";
}

input.addEventListener("keydown", async e => {
  if (e.key === "Enter" && input.value.trim()) {
    const text = input.value;
    input.value = "";

    addMessage(text, "user");

    try {
      const res = await fetch("https://chatbr.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      typeMessage(data.reply);
    } catch {
      addMessage("Erro ao conectar com o servidor.", "bot");
    }
  }
});

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function typeMessage(text) {
  const div = document.createElement("div");
  div.className = "msg bot";
  chat.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.innerText += text[i++];
    chat.scrollTop = chat.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}
