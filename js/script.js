const API = "https://chatbr.onrender.com";

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = `message ${cls}`;
  messages.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.textContent += text[i];
    i++;
    messages.scrollTop = messages.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  addMessage(data.reply, "bot");
}

/* MODAL */
function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}
function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}
function showRegister() {
  closeLogin();
  document.getElementById("registerModal").style.display = "flex";
}
function closeRegister() {
  document.getElementById("registerModal").style.display = "none";
}
function showLogin() {
  closeRegister();
  openLogin();
}

