const API = "https://chatbr.onrender.com";
let mode = "login";

function toggleModal() {
  document.getElementById("modal").style.display = "none";
}

function switchMode() {
  mode = mode === "login" ? "register" : "login";
  document.getElementById("modalTitle").innerText =
    mode === "login" ? "Entrar" : "Criar conta";
}

function submitAuth() {
  fetch(`${API}/${mode}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  }).then(r => {
    if (r.ok) toggleModal();
    else alert("Erro");
  });
}

function typeWriter(el, text) {
  let i = 0;
  el.textContent = "";
  function t() {
    if (i < text.length) {
      el.textContent += text[i++];
      el.scrollIntoView({behavior:"smooth"});
      setTimeout(t, 18);
    }
  }
  t();
}

function send() {
  if (!input.value) return;

  const user = document.createElement("div");
  user.className = "message user";
  user.textContent = input.value;
  chat.appendChild(user);

  fetch(`${API}/chat`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message: input.value})
  })
  .then(r => r.json())
  .then(d => {
    const bot = document.createElement("div");
    bot.className = "message bot";
    chat.appendChild(bot);
    typeWriter(bot, d.reply);
  });

  input.value = "";
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
