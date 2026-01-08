const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");

const modal = document.getElementById("loginModal");
const openLogin = document.getElementById("openLogin");
const closeModal = document.getElementById("closeModal");
const switchToRegister = document.getElementById("switchToRegister");
const modalTitle = document.getElementById("modalTitle");

openLogin.onclick = () => modal.style.display = "flex";
closeModal.onclick = () => modal.style.display = "none";

switchToRegister.onclick = () => {
  modalTitle.textContent = "Criar conta";
};

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    sendMessage();
  }
});

async function sendMessage() {
  const text = input.value;
  input.value = "";

  addMessage(text, "user");
  const bot = addMessage("", "bot");

  try {
    const res = await fetch("https://chatbr.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typeText(bot, data.reply);
  } catch {
    typeText(bot, "Erro ao conectar com o servidor.");
  }
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function typeText(el, text) {
  let i = 0;
  el.textContent = "";
  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i++];
      chat.scrollTop = chat.scrollHeight;
    } else {
      clearInterval(interval);
    }
  }, 20);
}
