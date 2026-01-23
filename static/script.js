let isRegister = false;

const chat = document.getElementById("chat");
const msgInput = document.getElementById("msg");

function send() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMsg(text);
  msgInput.value = "";

  fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message: text})
  })
  .then(r => r.json())
  .then(d => addMsg(d.reply));
}

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function addMsg(text) {
  const div = document.createElement("div");
  div.className = "msg";
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* MODAL */
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function toggle() {
  isRegister = !isRegister;
  document.getElementById("modalTitle").innerText =
    isRegister ? "Criar conta" : "Entrar";
}

function submit() {
  const email = email.value;
  const password = password.value;

  fetch(isRegister ? "/register" : "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  })
  .then(r => r.json())
  .then(d => {
    if (d.ok) closeModal();
    else alert("Erro");
  });
}
