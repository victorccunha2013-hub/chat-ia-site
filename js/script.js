const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

/* ENTER envia / SHIFT+ENTER quebra linha */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* Clique no botão */
sendBtn.addEventListener("click", sendMessage);

/* Mensagem do usuário */
function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "message user";
  div.textContent = text;
  messages.appendChild(div);
  scrollBottom();
}

/* Mensagem da IA com animação */
function typeAIMessage(text) {
  const div = document.createElement("div");
  div.className = "message ai";
  messages.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.textContent += text[i];
    i++;
    scrollBottom();
    if (i >= text.length) clearInterval(interval);
  }, 20);
}

/* Scroll automático */
function scrollBottom() {
  messages.scrollTop = messages.scrollHeight;
}

/* Envio */
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typeAIMessage(data.reply);
  } catch {
    typeAIMessage("⚠️ Erro ao conectar com o servidor.");
  }
}
