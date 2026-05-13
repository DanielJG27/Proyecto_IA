import { useRef, useEffect } from "react"

function InputArea({
  texto,
  setTexto,
  enviar,
  manejarKeyDown
}) {

  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 150) + 'px'
    }
  }, [texto])

  return (

    <div className="input-area">

      <textarea
        ref={textareaRef}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={manejarKeyDown}
        placeholder="Pega tu texto o escribe tu pregunta..."
        rows="1"
      ></textarea>

      <button
        className={`btn-send ${!texto.trim() ? 'disabled' : ''}`}
        onClick={enviar}
        disabled={!texto.trim()}
        title="Enviar mensaje"
      >
        ↑
      </button>

    </div>

  )
}

export default InputArea