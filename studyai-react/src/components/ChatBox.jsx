import Message from "./Message"
import { useRef, useEffect } from "react"

function ChatBox({ mensajes, cargando }) {

  const chatEndRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, cargando])

  return (

    <div className="chat">

      {mensajes.map((msg, index) => (
        <Message
          key={index}
          msg={msg}
        />
      ))}

      {cargando && (
        <div className="message bot loader">
          <div className="bot-header">
            <div className="bot-avatar">🤖</div>
            <span className="bot-name">StudyAI</span>
          </div>
          <div className="loader-content">
            <div className="loader-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="loader-text">Analizando tu texto...</span>
          </div>
        </div>
      )}

      <div ref={chatEndRef} />

    </div>

  )
}

export default ChatBox