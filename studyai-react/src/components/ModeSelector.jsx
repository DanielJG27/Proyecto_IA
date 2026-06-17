function ModeSelector({ modoActual, cambiarModo }) {

  const modos = [
    { id: "resumen",   icon: "📝", label: "Resumen" },
    { id: "preguntas", icon: "❓", label: "Preguntas" },
    { id: "explicar",  icon: "💡", label: "Explicar fácil" },
    { id: "quiz",      icon: "🎯", label: "Quiz" },
  ]

  return (

    <div className="modo-selector">

      {modos.map((modo) => (
        <button
          key={modo.id}
          className={`modo ${modoActual === modo.id ? "active" : ""}`}
          onClick={() => cambiarModo(modo.id)}
        >
          <span className="modo-icon">{modo.icon}</span>
          {modo.label}
        </button>
      ))}

    </div>

  )
}

export default ModeSelector