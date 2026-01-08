const API = "https://chatbr.onrender.com";

const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

const modal = document.getElementById("loginModal");
const userIcon = document.getElementById("userIcon");
const closeModal = document.getElementById("closeModal");

userIcon.onclick = () => modal.classList.remove("hidden");
closeModal.onclick = () => modal.classList.add("hidden");

input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

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
