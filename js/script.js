const input = document.getElementById("input");
const messages = document.getElementById("messages");

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    const text = input.value;
    input.value = "";

    addMessage(text, "user");

    const res = await fetch("https://chatbr.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typeBotMessage(data.reply);
  }
});

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function typeBotMessage(text) {
  const div = document.createElement("div");
  div.className = "message bot";
  messages.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.textContent += text[i];
    i++;
    messages.scrollTop = messages.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}
