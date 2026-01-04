document.addEventListener("DOMContentLoaded", () => {

  const chat = document.getElementById("chat");
  const input = document.getElementById("message");

  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.innerText = `${sender}: ${text}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  window.sendMessage = async function () {
    if (!input) {
      console.error("Input não encontrado");
      return;
    }

    const text = input.value.trim();
    if (!text) return;

    addMessage("Você", text);
    input.value = "";

    try {
      const response = await fetch("https://chatbr.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      addMessage("IA", data.reply);

    } catch (error) {
      addMessage("Erro", "Falha ao conectar");
      console.error(error);
    }
  };

});
