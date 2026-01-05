console.log("✅ script.js carregado");

const BASE_URL = "http://127.0.0.1:5000";

// ELEMENTOS
const userCircle = document.getElementById("userCircle");
const loginModal = document.getElementById("loginModal");
const createModal = document.getElementById("createModal");

// ABRIR MODAL
userCircle.onclick = () => loginModal.style.display = "flex";

// FECHAR
document.getElementById("closeLogin").onclick = () => loginModal.style.display = "none";
document.getElementById("closeCreate").onclick = () => createModal.style.display = "none";

// TROCA
document.getElementById("goCreate").onclick = () => {
  loginModal.style.display = "none";
  createModal.style.display = "flex";
};

document.getElementById("goLogin").onclick = () => {
  createModal.style.display = "none";
  loginModal.style.display = "flex";
};

// CRIAR CONTA
document.getElementById("createBtn").onclick = async () => {
  console.log("🟢 Criar conta clicado");

  const email = document.getElementById("createEmail").value;
  const password = document.getElementById("createPassword").value;
  const status = document.getElementById("createStatus");

  if (!email || !password) {
    status.textContent = "Preencha tudo";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    status.textContent = data.message || data.error;

  } catch {
    status.textContent = "Erro ao conectar";
  }
};

// LOGIN
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const status = document.getElementById("loginStatus");

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    status.textContent = data.message || data.error;

  } catch {
    status.textContent = "Erro ao conectar";
  }
};
