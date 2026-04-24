let modoActual = "resumen";

function setModo(modo) {
  modoActual = modo;

  document.querySelectorAll(".modo").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
}
let chats = [];

async function enviar() {
  const input = document.getElementById("texto");
  const chat = document.getElementById("chat");
  const texto = input.value;

  if (!texto) return;

  // Usuario
  chat.innerHTML += `<div class="message user">${texto}</div>`;
  input.value = "";

  // Loader
  const loaderId = "loader";
  chat.innerHTML += `<div id="${loaderId}" class="message bot loader">Pensando...</div>`;
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("http://localhost:5220/api/Study/resumen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({  texto, modo: modoActual  })
    });

    const data = await res.json();

    document.getElementById(loaderId).remove();

    const respuesta = `
    <div class="card resumen">
        <strong>Resumen:</strong><br>${data.resumen}
    </div>

    <div class="card preguntas">
        <strong>Preguntas:</strong>
        <ul>
        ${data.preguntas.map(p => `<li>${p}</li>`).join("")}
        </ul>
    </div>
    `;

    chat.innerHTML += `<div class="message bot">${respuesta}</div>`;
    chat.scrollTop = chat.scrollHeight;

    // Guardar historial
    chats.push(texto);
    renderHistorial();

  } catch {
    document.getElementById(loaderId).remove();
    chat.innerHTML += `<div class="message bot">Error</div>`;
  }
}

// Enter para enviar
document.getElementById("texto").addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviar();
  }
});

// Nuevo chat
function nuevoChat() {
  document.getElementById("chat").innerHTML = "";
}

// Sidebar historial
function renderHistorial() {
  const historial = document.getElementById("historial");
  historial.innerHTML = chats
    .map(c => `<div style="margin-bottom:10px;">${c}</div>`)
    .join("");
}