function ModeSelector({ modoActual, cambiarModo }) {

  return (

    <div className="modo-selector">

      <button
        className={`modo ${modoActual === "resumen" ? "active" : ""}`}
        onClick={() => cambiarModo("resumen")}
      >
        Resumen
      </button>

      <button
        className={`modo ${modoActual === "preguntas" ? "active" : ""}`}
        onClick={() => cambiarModo("preguntas")}
      >
        Preguntas
      </button>

      <button
        className={`modo ${modoActual === "explicar" ? "active" : ""}`}
        onClick={() => cambiarModo("explicar")}
      >
        Explicar fácil
      </button>

      <button
        className={`modo ${modoActual === "quiz" ? "active" : ""}`}
        onClick={() => cambiarModo("quiz")}
      >
        Quiz
      </button>

    </div>

  )
}

export default ModeSelector