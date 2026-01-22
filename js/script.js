const chat = document.getElementById("chat");
const input = document.getElementById("msg");

document.getElementById("sendBtn").onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function send() {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  const div = document.createElement("div");
  div.textContent = text;
  div.style.marginBottom = "10px";
  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;
}

/* MODAL */
const modal = document.getElementById("loginModal");
document.getElementById("openLogin").onclick = () => modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
