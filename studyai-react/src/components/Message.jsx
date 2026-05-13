function Message({ msg }) {

  return (

    <div className={`message ${msg.tipo}`}>

      {msg.tipo === "user" ? (

        <div className="user-bubble">
          {msg.contenido}
        </div>

      ) : (

        <>
          <div className="bot-header">
            <div className="bot-avatar">🤖</div>
            <span className="bot-name">StudyAI</span>
          </div>

          <div className="card resumen">

            <strong>📝 Respuesta</strong>
            <br />

            {msg.resumen}

          </div>

          {msg.preguntas && msg.preguntas.length > 0 && (
            <div className="card preguntas">

              <strong>❓ Preguntas</strong>

              <ul>
                {msg.preguntas.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>

            </div>
          )}
        </>

      )}

    </div>

  )
}

export default Message