import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import ModeSelector from "./components/ModeSelector"
import InputArea from "./components/InputArea"
import ChatBox from "./components/ChatBox"
import Dashboard from "./components/Dashboard"
import AuthModal from "./components/AuthModal"
import PomodoroTimer from "./components/PomodoroTimer"
import StudyGoals from "./components/StudyGoals"
import Flashcards from "./components/Flashcards"
import Achievements from "./components/Achievements"
import { useAuth } from "./context/AuthContext"
import logo from './assets/logo.png'

function App() {
  const { token, logout } = useAuth();
  
  // View state
  const [view, setView] = useState('dashboard'); // 'chat' or 'dashboard'

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

  // Fetch History when logged in
  useEffect(() => {
    if (token) {
      // Para cargar historial en el sidebar - esto es opcional, lo simularemos guardando localmente o podrias hacer un endpoint GET /api/Study/history
      // Por ahora agregaremos los chats nuevos al state `chats` con el formato { prompt, response }
    }
  }, [token])

  // Cambiar modo
  function cambiarModo(modo) {
    setModoActual(modo)
  }

  function seleccionarModoBienvenida(modo) {
    setModoActual(modo)
    setTimeout(() => {
      const textarea = document.querySelector('.input-area textarea')
      if (textarea) {
        textarea.focus()
      }
    }, 50)
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          texto: textoActual,
          modo: modoActual
        })
      })

      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Cuota de la API de IA excedida (20 consultas diarias). Por favor, intenta de nuevo en unos minutos o más tarde.");
        }
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json()

      // Mensaje bot
      const respuestaBot = {
        tipo: "bot",
        resumen: data.data,
        preguntas: []
      }

      setMensajes(prev => [...prev, respuestaBot])

      // Guardar historial para el sidebar
      setChats(prev => [...prev, { prompt: textoActual, response: data.data }])

    } catch (error) {
      console.error(error)

      const errorBot = {
        tipo: "bot",
        resumen: error.message.includes("Cuota") 
          ? `⚠️ ${error.message}`
          : "⚠️ Error al conectar con el servidor o procesar la solicitud. Asegúrate de que el backend esté corriendo.",
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
      {!token && <AuthModal />}

      <Sidebar
        chats={chats}
        nuevoChat={nuevoChat}
        setView={setView}
        activeView={view}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {view === 'dashboard' && <Dashboard />}

        {view === 'chat' && (
          <div className="chat-container">
            {/* Welcome screen or Messages */}
            {mensajes.length === 0 && !cargando ? (
              <div className="welcome-screen">
                <div className="welcome-icon">
                  <img src={logo} alt="Logo" className="welcome-logo-img" />
                </div>
                <h2>¿Qué quieres aprender hoy?</h2>
                <p>
                  Pega cualquier texto y Learnsync AI te ayudará a comprenderlo mejor con
                  resúmenes, preguntas, explicaciones simples o quizzes.
                </p>
                <div className="welcome-features">
                  <button className="welcome-feature" onClick={() => seleccionarModoBienvenida('resumen')}>
                    <span className="feature-icon">📝</span>
                    <span className="feature-text">Resúmenes claros</span>
                  </button>
                  <button className="welcome-feature" onClick={() => seleccionarModoBienvenida('preguntas')}>
                    <span className="feature-icon">❓</span>
                    <span className="feature-text">Preguntas de estudio</span>
                  </button>
                  <button className="welcome-feature" onClick={() => seleccionarModoBienvenida('explicar')}>
                    <span className="feature-icon">💡</span>
                    <span className="feature-text">Explicaciones fáciles</span>
                  </button>
                  <button className="welcome-feature" onClick={() => seleccionarModoBienvenida('quiz')}>
                    <span className="feature-icon">🎯</span>
                    <span className="feature-text">Quizzes interactivos</span>
                  </button>
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
        )}

        {view === 'flashcards' && <Flashcards />}
        {view === 'pomodoro' && <PomodoroTimer />}
        {view === 'goals' && <StudyGoals />}
        {view === 'achievements' && <Achievements />}
      </div>
    </div>
  )
}

export default App