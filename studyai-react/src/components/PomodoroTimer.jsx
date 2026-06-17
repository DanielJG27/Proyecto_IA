import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const PomodoroTimer = () => {
  const { token } = useAuth();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [subject, setSubject] = useState('');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalStudied, setTotalStudied] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const STUDY_TIME = 25;
  const BREAK_TIME = 5;

  const totalSeconds = isBreak ? BREAK_TIME * 60 : STUDY_TIME * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(prevMin => {
              if (prevMin === 0) {
                // Timer completed
                clearInterval(intervalRef.current);
                handleTimerComplete();
                return 0;
              }
              return prevMin - 1;
            });
            return prev === 0 && minutes === 0 ? 0 : 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, minutes]);

  const handleTimerComplete = async () => {
    setIsRunning(false);

    if (!isBreak) {
      // Study session completed
      setCyclesCompleted(prev => prev + 1);
      setTotalStudied(prev => prev + STUDY_TIME);

      // Auto-log to backend
      if (token && subject) {
        try {
          await fetch('http://localhost:5220/api/habits/log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ subject: subject || 'General', durationMinutes: STUDY_TIME })
          });
        } catch (err) { console.error('Error logging:', err); }
      }

      // Switch to break
      setIsBreak(true);
      setMinutes(BREAK_TIME);
      setSeconds(0);
    } else {
      // Break completed, switch back to study
      setIsBreak(false);
      setMinutes(STUDY_TIME);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    if (!isRunning && !isBreak && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(STUDY_TIME);
    setSeconds(0);
    startTimeRef.current = null;
  };

  const skipToNext = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    if (!isBreak) {
      setIsBreak(true);
      setMinutes(BREAK_TIME);
    } else {
      setIsBreak(false);
      setMinutes(STUDY_TIME);
    }
    setSeconds(0);
  };

  return (
    <div className="pomodoro-container fade-in">
      <div className="pomodoro-header">
        <h1>🍅 Pomodoro Timer</h1>
        <p>{isBreak ? 'Tiempo de descanso — relájate' : 'Tiempo de concentración — ¡a estudiar!'}</p>
      </div>

      <div className="pomodoro-main">
        <div className="timer-ring-wrapper">
          <svg className="timer-ring" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" className="timer-ring-bg" />
            <circle
              cx="130" cy="130" r="120"
              className={`timer-ring-progress ${isBreak ? 'break' : 'study'}`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="timer-display">
            <span className={`timer-time ${isBreak ? 'break-color' : ''}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="timer-label">{isBreak ? '☕ Descanso' : '📖 Estudio'}</span>
          </div>
        </div>

        <div className="pomodoro-controls">
          <button className="pomo-btn secondary" onClick={resetTimer} title="Reiniciar">
            🔄
          </button>
          <button className={`pomo-btn primary ${isRunning ? 'pause' : 'play'}`} onClick={toggleTimer}>
            {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
          </button>
          <button className="pomo-btn secondary" onClick={skipToNext} title="Saltar">
            ⏭️
          </button>
        </div>

        {!isRunning && !isBreak && minutes === STUDY_TIME && seconds === 0 && (
          <div className="pomo-subject-input">
            <input
              type="text"
              placeholder="¿Qué vas a estudiar? (ej. Matemáticas)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="pomo-stats-row">
        <div className="pomo-stat">
          <span className="pomo-stat-value">{cyclesCompleted}</span>
          <span className="pomo-stat-label">Ciclos hoy</span>
        </div>
        <div className="pomo-stat">
          <span className="pomo-stat-value">{totalStudied}</span>
          <span className="pomo-stat-label">Minutos</span>
        </div>
        <div className="pomo-stat">
          <span className="pomo-stat-value">{subject || '—'}</span>
          <span className="pomo-stat-label">Materia</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
