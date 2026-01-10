const api = "https://chatbr.onrender.com";

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function addMessage(text) {
  const div = document.createElement("div");
  div.className = "msg";
  let i = 0;

  function type() {
    if (i < text.length) {
      div.textContent += text[i++];
      setTimeout(type, 20);
    }
  }

  type();
  document.getElementById("chat").appendChild(div);
}

async function send() {
  const input = document.getElementById("msg");
  const msg = input.value;
  input.value = "";

  addMessage(msg);

  const res = await fetch(api + "/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message: msg})
  });

  const data = await res.json();
  addMessage(data.reply);
}

async function signup() {
  await fetch(api + "/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });
  alert("Confirme no email!");
}

async function login() {
  const res = await fetch(api + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  if (res.ok) closeModal();
  else alert("Erro ao logar");
}
