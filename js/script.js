const chatMessages = document.getElementById("chat-messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const avatar = document.getElementById("avatar");

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "message ai typing";
  typing.id = "typing-indicator";
  typing.innerText = "ChatScript está digitando...";
  chatMessages.appendChild(typing);

  avatar.classList.add("avatar-thinking");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
  avatar.classList.remove("avatar-thinking");
}

function typeWriter(text, element, speed = 20) {
  let i = 0;
  element.innerText = "";

  function typing() {
    if (i < text.length) {
      element.innerText += text[i];
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  showTyping();

  fetch("https://chatbr.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => {
      removeTyping();

      const aiMsg = document.createElement("div");
      aiMsg.className = "message ai";
      chatMessages.appendChild(aiMsg);

      typeWriter(data.reply, aiMsg);
    })
    .catch(() => {
      removeTyping();
      const err = document.createElement("div");
      err.className = "message ai";
      err.innerText = "⚠️ Erro ao conectar com o servidor.";
      chatMessages.appendChild(err);
    });
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
