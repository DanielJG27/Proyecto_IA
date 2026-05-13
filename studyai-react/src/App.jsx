import { useState } from "react"
import Sidebar from "./components/Sidebar"
import ModeSelector from "./components/ModeSelector"
import InputArea from "./components/InputArea"
import ChatBox from "./components/ChatBox"

function App() {

  // Estado del textarea
  const [texto, setTexto] = useState("")

  // Estado del modo
  const [modoActual, setModoActual] = useState("resumen")

  // Estado de mensajes del chat
  const [mensajes, setMensajes] = useState([])

  // Historial
  const [chats, setChats] = useState([])

  // Loader
  const [cargando, setCargando] = useState(false)

  // Cambiar modo
  function cambiarModo(modo) {
    setModoActual(modo)
  }

  // Nuevo chat
  function nuevoChat() {
    setMensajes([])
  }

  // Enviar mensaje
  async function enviar() {

    if (!texto.trim()) return

    // Mensaje usuario
    const nuevoMensajeUsuario = {
      tipo: "user",
      contenido: texto
    }

    setMensajes(prev => [...prev, nuevoMensajeUsuario])

    // Guardar texto antes de limpiar
    const textoActual = texto

    // Limpiar textarea
    setTexto("")

    // Mostrar loader
    setCargando(true)

    try {

      const res = await fetch("http://localhost:5220/api/Study/resumen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          texto: textoActual,
          modo: modoActual
        })
      })

      const data = await res.json()

      // Mensaje bot
      const respuestaBot = {
        tipo: "bot",
        resumen: data.data,
        preguntas: []
      }

      setMensajes(prev => [...prev, respuestaBot])

      // Guardar historial
      setChats(prev => [...prev, textoActual])

    } catch (error) {

      console.error(error)

      const errorBot = {
        tipo: "bot",
        resumen: "⚠️ Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.",
        preguntas: []
      }

      setMensajes(prev => [...prev, errorBot])

    } finally {

      setCargando(false)

    }
  }

  // Enter para enviar
  function manejarKeyDown(e) {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }

  }

  return (

    <div className="layout">

      <Sidebar
        chats={chats}
        nuevoChat={nuevoChat}
      />

      {/* Chat */}
      <div className="chat-container">

        {/* Welcome screen or Messages */}
        {mensajes.length === 0 && !cargando ? (
          <div className="welcome-screen">
            <div className="welcome-icon">📚</div>
            <h2>¿Qué quieres aprender hoy?</h2>
            <p>
              Pega cualquier texto y StudyAI te ayudará a comprenderlo mejor con
              resúmenes, preguntas, explicaciones simples o quizzes.
            </p>
            <div className="welcome-features">
              <div className="welcome-feature">
                <span className="feature-icon">📝</span>
                <span className="feature-text">Resúmenes claros</span>
              </div>
              <div className="welcome-feature">
                <span className="feature-icon">❓</span>
                <span className="feature-text">Preguntas de estudio</span>
              </div>
              <div className="welcome-feature">
                <span className="feature-icon">💡</span>
                <span className="feature-text">Explicaciones fáciles</span>
              </div>
              <div className="welcome-feature">
                <span className="feature-icon">🎯</span>
                <span className="feature-text">Quizzes interactivos</span>
              </div>
            </div>
          </div>
        ) : (
          <ChatBox
            mensajes={mensajes}
            cargando={cargando}
          />
        )}

        {/* Bottom: Mode + Input */}
        <div className="bottom-area">
          <div className="bottom-inner">

            {/* Selector de modo */}
            <ModeSelector
              modoActual={modoActual}
              cambiarModo={cambiarModo}
            />

            {/* Input */}
            <InputArea
              texto={texto}
              setTexto={setTexto}
              enviar={enviar}
              manejarKeyDown={manejarKeyDown}
            />

            <div className="input-hint">
              Presiona <strong>Enter</strong> para enviar · <strong>Shift + Enter</strong> para nueva línea
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

export default App