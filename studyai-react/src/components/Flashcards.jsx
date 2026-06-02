import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Flashcards = () => {
  const { token, logout } = useAuth();
  const [inputText, setInputText] = useState('');
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState({ knew: 0, review: 0 });
  const [error, setError] = useState('');

  const getFontSize = (text = '') => {
    if (text.length > 200) return '13px';
    if (text.length > 120) return '15px';
    if (text.length > 60) return '17px';
    return '20px';
  };

  const generateFlashcards = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError('');
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setScores({ knew: 0, review: 0 });

    try {
      const res = await fetch('http://localhost:5220/api/Study/resumen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          texto: inputText,
          modo: 'flashcards'
        })
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Cuota de la API de IA excedida (20 consultas diarias). Por favor, intenta de nuevo más tarde.");
        }
        throw new Error("Error al generar las flashcards. Asegúrate de que el backend esté funcionando correctamente.");
      }
      const data = await res.json();
      if (data.data) {
        // Parse the AI response into flashcards
        const parsed = parseFlashcards(data.data);
        setCards(parsed);
      }
    } catch (err) {
      console.error('Error generating flashcards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseFlashcards = (text) => {
    const cards = [];
    // Try to parse numbered Q&A pairs
    const lines = text.split('\n').filter(l => l.trim());
    let currentQ = '';
    let currentA = '';

    for (const line of lines) {
      const trimmed = line.trim();
      // Match patterns like "Pregunta 1:", "P1:", "1.", "**Pregunta:**" etc
      if (/^(\d+[\.\):]|pregunta\s*\d*[:\.]|\*\*pregunta|p\d+[:\.]|q\d+[:\.])/i.test(trimmed)) {
        if (currentQ && currentA) {
          cards.push({ question: currentQ.trim(), answer: currentA.trim() });
        }
        currentQ = trimmed.replace(/^(\d+[\.\):]|pregunta\s*\d*[:\.]|\*\*pregunta\**[:\.]?|p\d+[:\.]|q\d+[:\.])\s*/i, '');
        currentA = '';
      } else if (/^(respuesta[:\.]|\*\*respuesta|r[:\.]|a[:\.])/i.test(trimmed)) {
        currentA = trimmed.replace(/^(respuesta[:\.]|\*\*respuesta\**[:\.]?|r[:\.]|a[:\.])\s*/i, '');
      } else if (currentQ && !currentA) {
        currentQ += ' ' + trimmed;
      } else if (currentQ && currentA) {
        currentA += ' ' + trimmed;
      }
    }
    if (currentQ && currentA) {
      cards.push({ question: currentQ.trim(), answer: currentA.trim() });
    }

    // Fallback: if parsing failed, split by double newlines
    if (cards.length === 0) {
      const chunks = text.split(/\n\n+/);
      for (let i = 0; i < chunks.length - 1; i += 2) {
        cards.push({
          question: chunks[i].replace(/^\*+|\*+$/g, '').trim(),
          answer: (chunks[i + 1] || 'Sin respuesta').replace(/^\*+|\*+$/g, '').trim()
        });
      }
    }

    // Last fallback: create a single card
    if (cards.length === 0) {
      cards.push({ question: 'Contenido generado', answer: text });
    }

    return cards;
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => Math.min(prev + 1, cards.length - 1));
    }, 200);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }, 200);
  };

  const markKnew = () => {
    setScores(prev => ({ ...prev, knew: prev.knew + 1 }));
    if (currentIndex < cards.length - 1) nextCard();
  };

  const markReview = () => {
    setScores(prev => ({ ...prev, review: prev.review + 1 }));
    if (currentIndex < cards.length - 1) nextCard();
  };

  return (
    <div className="flashcards-container fade-in">
      <div className="flashcards-header">
        <h1>🃏 Flashcards con IA</h1>
        <p>Pega un texto y la IA generará tarjetas de estudio</p>
      </div>

      {error && (
        <div className="flashcards-error-alert" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {cards.length === 0 ? (
        <div className="flashcards-input-section glass-panel">
          <textarea
            placeholder="Pega aquí el texto del que quieres generar flashcards..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
          />
          <button
            className="generate-btn"
            onClick={generateFlashcards}
            disabled={loading || !inputText.trim()}
          >
            {loading ? '⏳ Generando...' : '✨ Generar Flashcards'}
          </button>
        </div>
      ) : (
        <>
          <div className="flashcard-progress">
            <span>{currentIndex + 1} / {cards.length}</span>
            <div className="flashcard-progress-bar">
              <div
                className="flashcard-progress-fill"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flashcard-wrapper" onClick={() => setFlipped(!flipped)}>
            <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
              <div className="flashcard-front">
                <span className="flashcard-label">PREGUNTA</span>
                <p style={{ fontSize: getFontSize(cards[currentIndex]?.question) }}>
                  {cards[currentIndex]?.question}
                </p>
                <span className="flashcard-hint">Toca para voltear</span>
              </div>
              <div className="flashcard-back">
                <span className="flashcard-label answer-label">RESPUESTA</span>
                <p style={{ fontSize: getFontSize(cards[currentIndex]?.answer) }}>
                  {cards[currentIndex]?.answer}
                </p>
              </div>
            </div>
          </div>

          <div className="flashcard-actions">
            <button className="fc-btn review-btn" onClick={markReview}>
              🔄 Repasar ({scores.review})
            </button>
            <div className="fc-nav">
              <button className="fc-btn nav-btn" onClick={prevCard} disabled={currentIndex === 0}>←</button>
              <button className="fc-btn nav-btn" onClick={nextCard} disabled={currentIndex === cards.length - 1}>→</button>
            </div>
            <button className="fc-btn knew-btn" onClick={markKnew}>
              ✅ Lo sé ({scores.knew})
            </button>
          </div>

          <button className="new-deck-btn" onClick={() => { setCards([]); setInputText(''); }}>
            📝 Nuevo mazo
          </button>
        </>
      )}
    </div>
  );
};

export default Flashcards;
