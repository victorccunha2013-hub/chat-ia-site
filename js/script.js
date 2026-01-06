const messages = document.getElementById("messages");

function typeText(element, text) {
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 30);
}

// TESTE AUTOMÁTICO
const div = document.createElement("div");
div.className = "message bot";
messages.appendChild(div);

typeText(div, "Olá! Isso é um teste de animação letra por letra.");
