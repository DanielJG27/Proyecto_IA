function Message({ msg }) {

  return (

    <div className={`message ${msg.tipo}`}>

      {msg.tipo === "user" ? (

        msg.contenido

      ) : (

        <>
          <div className="card resumen">

            <strong>Resumen:</strong>
            <br />

            {msg.resumen}

          </div>

          <div className="card preguntas">

            <strong>Preguntas:</strong>

            <ul>
              {msg.preguntas?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>

          </div>
        </>

      )}

    </div>

  )
}

export default Message