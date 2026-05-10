function InputArea({
  texto,
  setTexto,
  enviar,
  manejarKeyDown
}) {

  return (

    <div className="input-area">

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={manejarKeyDown}
        placeholder="Escribe un mensaje..."
      ></textarea>

      <button onClick={enviar}>
        ➤
      </button>

    </div>

  )
}

export default InputArea