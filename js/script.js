let mode = "login";
let currentEmail = "";

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

function toggleRegister() {
  mode = mode === "login" ? "register" : "login";
  document.getElementById("title").innerText =
    mode === "login" ? "Entrar" : "Criar Conta";
}

function submitAuth() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  fetch(`/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message && mode === "register") {
        currentEmail = email;
        document.getElementById("confirmModal").style.display = "flex";
      }
      status.innerText = data.message || data.error;
    });
}

function confirmCode() {
  const code = document.getElementById("code").value;
  const status = document.getElementById("confirmStatus");

  fetch("/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentEmail, code })
  })
    .then(res => res.json())
    .then(data => {
      status.innerText = data.message || data.error;
    });
}

document.addEventListener("keydown", e => {
  if (e.key === "Enter") submitAuth();
});
