import Message from "./Message"

function ChatBox({ mensajes, cargando }) {

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
          Pensando...
        </div>
      )}

    </div>

  )
}

export default ChatBox