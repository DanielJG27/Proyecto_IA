import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Achievements = () => {
  const { token, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [goalsCompleted, setGoalsCompleted] = useState(0);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5220/api/habits/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error("Sesión expirada");
        }
        if (!res.ok) {
          throw new Error("Error en servidor");
        }
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => console.error("Error loading stats for achievements:", err));
    }

    // Load study goals from localStorage to compute completed goals count
    const saved = localStorage.getItem('studyGoals');
    if (saved) {
      try {
        const goals = JSON.parse(saved);
        const completed = goals.filter(g => g.completed).length;
        setGoalsCompleted(completed);
      } catch (e) {
        console.error("Error reading study goals for achievements:", e);
      }
    }
  }, [token]);

  const totalTime = stats.totalTimeMinutes || 0;
  const streak = stats.currentStreak || 0;

  const list = [
    {
      id: 'first-session',
      title: 'Primer Paso',
      desc: 'Registra tu primera sesión de estudio',
      icon: '🚀',
      targetType: 'time',
      target: 1,
      current: totalTime,
      completed: totalTime >= 1
    },
    {
      id: 'study-hour',
      title: 'Cerebro en Marcha',
      desc: 'Estudia un total de 60 minutos',
      icon: '⚡',
      targetType: 'time',
      target: 60,
      current: totalTime,
      completed: totalTime >= 60
    },
    {
      id: 'study-scholar',
      title: 'Erudito de Learnsync AI',
      desc: 'Estudia un total de 300 minutos (5 horas)',
      icon: '🧠',
      targetType: 'time',
      target: 300,
      current: totalTime,
      completed: totalTime >= 300
    },
    {
      id: 'streak-3',
      title: 'Constancia Temprana',
      desc: 'Alcanza una racha de 3 días de estudio',
      icon: '🔥',
      targetType: 'streak',
      target: 3,
      current: streak,
      completed: streak >= 3
    },
    {
      id: 'streak-7',
      title: 'Hábito de Hierro',
      desc: 'Alcanza una racha de 7 días de estudio',
      icon: '👑',
      targetType: 'streak',
      target: 7,
      current: streak,
      completed: streak >= 7
    },
    {
      id: 'first-goal',
      title: 'Metódico',
      desc: 'Completa al menos 1 meta de estudio',
      icon: '🎯',
      targetType: 'goals',
      target: 1,
      current: goalsCompleted,
      completed: goalsCompleted >= 1
    },
    {
      id: 'goals-5',
      title: 'Planificador Experto',
      desc: 'Completa 5 metas de estudio',
      icon: '🏆',
      targetType: 'goals',
      target: 5,
      current: goalsCompleted,
      completed: goalsCompleted >= 5
    }
  ];

  const completedCount = list.filter(a => a.completed).length;
  const progressPercent = Math.round((completedCount / list.length) * 100);

  return (
    <div className="achievements-container fade-in">
      <div className="achievements-header">
        <h1>🏆 Logros y Medallas</h1>
        <p>Gana insignias y mantén la motivación alta mientras estudias</p>
      </div>

      <div className="achievements-progress-card glass-panel">
        <div className="achievements-summary-info">
          <div>
            <h3>Progreso de Logros</h3>
            <p>{completedCount} de {list.length} completados</p>
          </div>
          <span className="achievements-percentage">{progressPercent}%</span>
        </div>
        <div className="goals-progress-track">
          <div className="goals-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="achievements-grid">
        {list.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card glass-panel ${achievement.completed ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon-wrapper">
              <span className="achievement-icon">{achievement.icon}</span>
            </div>
            <div className="achievement-details">
              <h3>{achievement.title}</h3>
              <p>{achievement.desc}</p>
              
              {!achievement.completed && (
                <div className="achievement-progress-info">
                  <div className="achievement-progress-bar-small">
                    <div 
                      className="achievement-progress-fill-small"
                      style={{ width: `${Math.min(100, Math.round((achievement.current / achievement.target) * 100))}%` }}
                    ></div>
                  </div>
                  <span className="achievement-progress-label">
                    {achievement.current} / {achievement.target} {achievement.targetType === 'time' ? 'min' : achievement.targetType === 'streak' ? 'días' : 'metas'}
                  </span>
                </div>
              )}
              {achievement.completed && (
                <span className="unlocked-badge">✨ Desbloqueado</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
