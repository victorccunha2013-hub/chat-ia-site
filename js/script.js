const API = "https://chatbr.onrender.com";

const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

const modal = document.getElementById("loginModal");
const userIcon = document.getElementById("userIcon");
const closeModal = document.getElementById("closeModal");

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const goRegister = document.getElementById("goRegister");

let logged = false;

// MODAL
userIcon.onclick = () => modal.classList.remove("hidden");
closeModal.onclick = () => modal.classList.add("hidden");

// LOGIN
loginBtn.onclick = async () => {
    const email = emailInput.value;
    const password = passInput.value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    logged = true;
    modal.classList.add("hidden");
};

// REGISTRO
goRegister.onclick = async () => {
    const email = emailInput.value;
    const password = passInput.value;

    const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message || data.error);
};

// CHAT
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
        addMessage("Erro ao conectar com o servidor", "bot");
    }
});

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
        if (i >= text.length) clearInterval(interval);
        messages.scrollTop = messages.scrollHeight;
    }, 20);
}
