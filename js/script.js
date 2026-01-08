const API = "https://chatbr.onrender.com";

const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

const modal = document.getElementById("loginModal");
const userIcon = document.getElementById("userIcon");
const closeModal = document.getElementById("closeModal");

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");

const modalTitle = document.getElementById("modalTitle");
const actionBtn = document.getElementById("actionBtn");
const switchText = document.getElementById("switchText");
const switchAction = document.getElementById("switchAction");

let mode = "login"; // login | register
let logged = false;

/* ---------- MODAL ---------- */
userIcon.onclick = () => modal.classList.remove("hidden");
closeModal.onclick = () => modal.classList.add("hidden");

switchAction.onclick = () => {
    if (mode === "login") {
        mode = "register";
        modalTitle.textContent = "Criar conta";
        actionBtn.textContent = "Criar conta";
        switchText.textContent = "Já tem conta?";
        switchAction.textContent = "Entrar";
    } else {
        mode = "login";
        modalTitle.textContent = "Entrar";
        actionBtn.textContent = "Entrar";
        switchText.textContent = "Não tem conta?";
        switchAction.textContent = "Crie aqui";
    }
};

/* ---------- LOGIN / REGISTER ---------- */
actionBtn.onclick = async () => {
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    if (!email || !password) {
        alert("Preencha todos os campos");
        return;
    }

    const endpoint = mode === "login" ? "login" : "register";

    try {
        const res = await fetch(`${API}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        if (mode === "login") {
            logged = true;
            modal.classList.add("hidden");
        } else {
            alert("Conta criada com sucesso! Agora faça login.");
            switchAction.click();
        }

    } catch {
        alert("Erro ao conectar com o servidor");
    }
};

/* ---------- CHAT ---------- */
input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    if (!logged) {
        modal.classList.remove("hidden");
        return;
    }

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {
        const res = await fetch(`${API}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();
        typeBot(data.reply);
    } catch {
        addMessage("⚠️ Erro ao conectar com o servidor.", "bot");
    }
});

/* ---------- UI ---------- */
function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function typeBot(text) {
    const div = document.createElement("div");
    div.className = "msg bot";
    messages.appendChild(div);

    let i = 0;
    const interval = setInterval(() => {
        div.textContent += text[i];
        i++;
        messages.scrollTop = messages.scrollHeight;
        if (i >= text.length) clearInterval(interval);
    }, 20);
}
