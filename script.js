document.addEventListener("DOMContentLoaded", () => {

  const chat = document.getElementById("chat");
  const input = document.getElementById("message");
  const button = document.getElementById("sendBtn");

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("message", type);
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.id = "typing";
    div.classList.add("message", "bot", "typing");
    div.innerText = "Digitando...";
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById("typing");
    if (typing) typing.remove();
  }

  window.sendMessage = async function () {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    button.disabled = true;

    showTyping();

    try {
      const response = await fetch("https://chatbr.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      removeTyping();
      addMessage(data.reply || "Sem resposta 😅", "bot");

    } catch (error) {
      removeTyping();
      addMessage("Erro ao conectar com o servidor 😢", "bot");
      console.error(error);
    }

    button.disabled = false;
  };

});
