const API = "https://chatbr.onrender.com";
let isRegister = false;

function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function toggleMode() {
  isRegister = !isRegister;
  document.getElementById("modalTitle").innerText = isRegister ? "Criar conta" : "Entrar";
  document.getElementById("toggle").innerText = isRegister
    ? "Já tem conta? Entrar"
    : "Não tem conta? Crie aqui";
}

async function submitAuth() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const route = isRegister ? "/register" : "/login";

  const res = await fetch(API + route, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });

  const data = await res.json();

  if (data.success) {
    closeModal();
    alert("Logado com sucesso!");
  } else {
    alert(data.error);
  }
}
