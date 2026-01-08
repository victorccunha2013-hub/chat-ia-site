const chat = document.getElementById("chat");
const input = document.getElementById("input");

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function send() {
  const text = input.value;
  if (!text) return;

  chat.innerHTML += `<div class="msg user">${text}</div>`;
  input.value = "";

  fetch("https://chatbr.onrender.com/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({message:text})
  })
  .then(r => r.json())
  .then(d => typeEffect(d.reply));
}

function typeEffect(text) {
  let i = 0;
  const el = document.createElement("div");
  el.className = "msg bot";
  chat.appendChild(el);

  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
    chat.scrollTop = chat.scrollHeight;
  }, 20);
}

// MODAL
let mode = "login";
function openModal(){ modal.classList.remove("hidden"); }
function closeModal(){ modal.classList.add("hidden"); }
function switchMode(){
  mode = mode === "login" ? "register" : "login";
  title.innerText = mode === "login" ? "Entrar" : "Criar conta";
}
function submit(){
  fetch(`https://chatbr.onrender.com/${mode}`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email:email.value,password:password.value})
  }).then(r=>r.json()).then(d=>alert(d.message||d.error));
}
