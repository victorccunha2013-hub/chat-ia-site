const API = "https://chatbr.onrender.com";

function login() {
  fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("user", data.email);
      loginModal.style.display = "none";
    } else alert("Erro no login");
  });
}

function register() {
  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) alert("Conta criada!");
    else alert(data.error);
  });
}

function sendMessage() {
  const text = userInput.value;
  if (!text) return;

  fetch(API + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .then(r => r.json())
  .then(data => {
    messages.innerHTML += `<div>${data.reply}</div>`;
  });
}
