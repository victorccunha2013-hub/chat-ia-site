const form = document.getElementById("chat-form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

// 🔴 COLOQUE SUA URL DO RENDER AQUI
const API = "https://SEU_BACKEND.onrender.com";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

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
        addMessage(data.reply, "ai");
    } catch {
        addMessage("Erro ao conectar com o servidor", "ai");
    }
});

function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
