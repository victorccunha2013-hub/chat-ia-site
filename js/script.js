const API = "https://chatbr.onrender.com";

function send() {
  const input = document.getElementById("msg");
  const text = input.value;
  input.value = "";

  fetch(API + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(r => r.json())
    .then(d => {
      document.getElementById("chat").innerHTML +=
        "<p><b>Você:</b> " + text + "</p>" +
        "<p><b>IA:</b> " + d.reply + "</p>";
    });
}

document.getElementById("msg").addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
