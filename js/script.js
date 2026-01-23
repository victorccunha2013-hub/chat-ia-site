let mode = "login";

function openModal() {
  document.getElementById("authModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("authModal").style.display = "none";
  document.getElementById("status").innerText = "";
}

function toggleMode() {
  mode = mode === "login" ? "register" : "login";

  document.getElementById("modalTitle").innerText =
    mode === "login" ? "Entrar" : "Criar conta";

  document.getElementById("submitBtn").innerText =
    mode === "login" ? "Entrar" : "Criar conta";

  document.getElementById("switchText").innerText =
    mode === "login" ? "Não tem conta?" : "Já tem conta?";
}

function submitAuth() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("status");

  if (!email || !password) {
    status.innerText = "Preencha todos os campos";
    return;
  }

  fetch(`/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(r => r.json())
    .then(d => {
      status.innerText = d.message || d.error;
      if (d.message && mode === "login") closeModal();
    })
    .catch(() => {
      status.innerText = "Erro ao conectar com o servidor";
    });
}

/* ENTER FUNCIONA */
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.getElementById("authModal").style.display === "flex") {
    submitAuth();
  }
});
