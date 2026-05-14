import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/styles.css';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [analysis, setAnalysis] = useState('Analizando tus hábitos...');
  const [loading, setLoading] = useState(true);

  // New habit form state
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');

  const fetchData = async () => {
    try {
      // Fetch Dashboard Stats
      const statsRes = await fetch('http://localhost:5220/api/habits/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch AI Analysis
      const aiRes = await fetch('http://localhost:5220/api/study/analysis', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        setAnalysis(aiData.analysis);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setAnalysis("Error al obtener análisis. Verifica la conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
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
        fetchData(); // refresh data
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
          <p className="ai-text">{analysis}</p>
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
