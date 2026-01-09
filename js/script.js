const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openLogin");
const closeBtn = document.getElementById("closeModal");

const title = document.getElementById("modalTitle");
const confirmBtn = document.getElementById("confirmBtn");
const switchMode = document.getElementById("switchMode");
const switchText = document.getElementById("switchText");

let mode = "login";

openBtn.onclick = () => modal.classList.remove("hidden");
closeBtn.onclick = () => modal.classList.add("hidden");

switchMode.onclick = (e) => {
  e.preventDefault();

  if (mode === "login") {
    mode = "signup";
    title.textContent = "Criar conta";
    confirmBtn.textContent = "Criar conta";
    switchText.textContent = "Já tem uma conta?";
    switchMode.textContent = "Entrar";
  } else {
    mode = "login";
    title.textContent = "Entrar";
    confirmBtn.textContent = "Entrar";
    switchText.textContent = "Não tem uma conta?";
    switchMode.textContent = "Criar conta";
  }
};

confirmBtn.onclick = () => {
  alert(
    mode === "login"
      ? "Login (backend depois)"
      : "Criar conta (backend depois)"
  );
};
