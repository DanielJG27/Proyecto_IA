import React from 'react';

function Message({ msg }) {

  const formatMarkdown = (text = '') => {
    return text.split('\n').map((line, idx) => {
      const parts = [];
      let lastIndex = 0;
      // Regex matching **bold** or *italic*
      const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        const fullMatch = match[0];
        const matchIndex = match.index;
        
        if (matchIndex > lastIndex) {
          parts.push(line.substring(lastIndex, matchIndex));
        }
        
        if (fullMatch.startsWith('**')) {
          parts.push(<strong key={matchIndex}>{match[2]}</strong>);
        } else if (fullMatch.startsWith('*')) {
          parts.push(<em key={matchIndex}>{match[3]}</em>);
        }
        
        lastIndex = regex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      return (
        <React.Fragment key={idx}>
          {parts}
          {idx < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

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
            <span className="bot-name">Learnsync AI</span>
          </div>

          <div className="card resumen">

            <strong>📝 Respuesta</strong>
            <br />
            <br />

            {formatMarkdown(msg.resumen)}

          </div>

          {msg.preguntas && msg.preguntas.length > 0 && (
            <div className="card preguntas">

              <strong>❓ Preguntas</strong>

              <ul>
                {msg.preguntas.map((p, i) => (
                  <li key={i}>{formatMarkdown(p)}</li>
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