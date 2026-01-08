const API = "https://chatbr.onrender.com";

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
    const res = await fetch(API + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    addMessage(data.reply, "bot");
  } catch {
    addMessage("Erro ao conectar com o servidor.", "bot");
  }
}

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerText = text;
  document.getElementById("messages").appendChild(msg);
  msg.scrollIntoView();
}

/* LOGIN (mantém) */
function openModal() {
  document.getElementById("modal").style.display = "block";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}
