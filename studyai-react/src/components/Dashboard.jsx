import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudyCalendar from './StudyCalendar';
import '../styles/styles.css';

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [analysis, setAnalysis] = useState('Analizando tus hábitos...');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);

  // New habit form state
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');

  const fetchStats = async () => {
    try {
      const statsRes = await fetch('http://localhost:5220/api/habits/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.status === 401) {
        logout();
        return;
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIAnalysis = async () => {
    setAiLoading(true);
    try {
      const aiRes = await fetch('http://localhost:5220/api/study/analysis', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (aiRes.status === 401) {
        logout();
        return;
      }
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        setAnalysis(aiData.analysis);
      }
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      setAnalysis("Error al obtener análisis. Verifica la conexión.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchAIAnalysis();
    }
  }, [token]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!subject || !duration) return;

    try {
      const res = await fetch('http://localhost:5220/api/habits/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject, durationMinutes: parseInt(duration) })
      });

      if (res.ok) {
        setSubject('');
        setDuration('');
        fetchStats(); // refresh data
        fetchAIAnalysis(); // refresh AI analysis
      }
    } catch (error) {
      console.error("Error adding habit", error);
    }
  };

  if (loading || !stats) {
    return <div className="dashboard-container"><div className="loading-spinner"></div><p>Cargando tu espacio...</p></div>;
  }

  return (
    <div className="dashboard-container fade-in">
      <header className="dashboard-header">
        <h1>Hola, {user.username} 👋</h1>
        <p>Aquí tienes el resumen de tu progreso.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon timer-icon">⏱️</div>
          <div className="stat-info">
            <h3>Tiempo Total</h3>
            <p className="stat-value">{stats.totalTimeMinutes} <span className="stat-unit">min</span></p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon streak-icon">🔥</div>
          <div className="stat-info">
            <h3>Racha Actual</h3>
            <p className="stat-value">{stats.currentStreak} <span className="stat-unit">días</span></p>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="ai-analysis-panel glass-panel">
          <div className="panel-header">
            <span className="sparkles">✨</span>
            <h2>Análisis de IA</h2>
          </div>
          {aiLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="loader-dots"><span></span><span></span><span></span></div>
              <p className="ai-text" style={{ opacity: 0.6 }}>Analizando tus hábitos recientes...</p>
            </div>
          ) : (
            <p className="ai-text">{analysis}</p>
          )}
        </div>

        <div className="add-habit-panel glass-panel">
          <h2>Registrar Sesión de Estudio</h2>
          <form onSubmit={handleAddHabit} className="habit-form">
            <input 
              type="text" 
              placeholder="Materia (ej. Matemáticas)" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              required 
            />
            <input 
              type="number" 
              placeholder="Minutos" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              required 
              min="1"
            />
            <button type="submit" className="add-btn">Registrar</button>
          </form>
        </div>

        <div className="profile-habits-panel glass-panel mt-4">
          <h2>Mi Perfil de Estudio 🎯</h2>
          <div className="profile-habits-list" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="profile-habit-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>⏱️ Horas diarias:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '13px' }}>{user.studyHours || 0} hrs</span>
            </div>
            <div className="profile-habit-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>📅 Días por semana:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '13px' }}>{user.daysPerWeek || 0} {user.daysPerWeek === 1 ? 'día' : 'días'}</span>
            </div>
            <div className="profile-habit-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>🧠 Concentración:</span>
              <span style={{ fontWeight: 600, color: 'var(--indigo)', fontSize: '13px' }}>{user.concentrationLevel || 'Medio'}</span>
            </div>
            <div className="profile-habit-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>📝 Otras variables / Notas:</span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, lineHeight: '1.4' }}>
                {user.otherVariables || 'Sin observaciones adicionales'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-calendar glass-panel mt-4">
        <StudyCalendar recentHabits={stats.allHabits || []} />
      </div>

      {stats.recentHabits && stats.recentHabits.length > 0 && (
        <div className="recent-history glass-panel mt-4">
          <h2>Historial Reciente</h2>
          <ul className="habit-list">
            {stats.recentHabits.map((habit, idx) => (
              <li key={idx} className="habit-item">
                <span className="habit-subject">{habit.subject}</span>
                <span className="habit-duration">{habit.durationMinutes} min</span>
                <span className="habit-date">{new Date(habit.studyDate).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
