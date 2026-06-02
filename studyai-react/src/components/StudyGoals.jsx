import React, { useState, useEffect } from 'react';

const StudyGoals = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('studyGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [newGoalSubject, setNewGoalSubject] = useState('');
  const [newGoalMinutes, setNewGoalMinutes] = useState('');

  useEffect(() => {
    localStorage.setItem('studyGoals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoalSubject || !newGoalMinutes) return;
    const goal = {
      id: Date.now(),
      subject: newGoalSubject,
      targetMinutes: parseInt(newGoalMinutes),
      completedMinutes: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [goal, ...prev]);
    setNewGoalSubject('');
    setNewGoalMinutes('');
  };

  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g =>
      g.id === id ? { ...g, completed: !g.completed, completedMinutes: !g.completed ? g.targetMinutes : 0 } : g
    ));
  };

  const updateProgress = (id, minutes) => {
    setGoals(prev => prev.map(g =>
      g.id === id ? {
        ...g,
        completedMinutes: Math.min(parseInt(minutes) || 0, g.targetMinutes),
        completed: (parseInt(minutes) || 0) >= g.targetMinutes
      } : g
    ));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const clearCompleted = () => {
    setGoals(prev => prev.filter(g => !g.completed));
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.completedMinutes / g.targetMinutes), 0) / goals.length * 100)
    : 0;

  return (
    <div className="goals-container fade-in">
      <div className="goals-header">
        <h1>🎯 Metas de Estudio</h1>
        <p>Establece objetivos y haz seguimiento de tu progreso</p>
      </div>

      {goals.length > 0 && (
        <div className="goals-overview glass-panel">
          <div className="goals-overview-bar">
            <div className="goals-progress-track">
              <div className="goals-progress-fill" style={{ width: `${totalProgress}%` }}></div>
            </div>
            <span className="goals-progress-text">{totalProgress}% completado</span>
          </div>
          <div className="goals-overview-stats">
            <span>{activeGoals.length} pendientes</span>
            <span>{completedGoals.length} completadas</span>
          </div>
        </div>
      )}

      <form className="goal-form glass-panel" onSubmit={addGoal}>
        <h3>➕ Nueva meta</h3>
        <div className="goal-form-row">
          <input
            type="text"
            placeholder="Materia (ej. Física)"
            value={newGoalSubject}
            onChange={(e) => setNewGoalSubject(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Minutos"
            value={newGoalMinutes}
            onChange={(e) => setNewGoalMinutes(e.target.value)}
            min="1"
            required
          />
          <button type="submit" className="add-btn">Crear</button>
        </div>
      </form>

      {activeGoals.length > 0 && (
        <div className="goals-section">
          <h3>📋 Metas activas</h3>
          <div className="goals-list">
            {activeGoals.map(goal => (
              <div key={goal.id} className="goal-card glass-panel">
                <div className="goal-card-top">
                  <button className="goal-check" onClick={() => toggleGoal(goal.id)}>⬜</button>
                  <div className="goal-info">
                    <span className="goal-subject">{goal.subject}</span>
                    <span className="goal-target">{goal.completedMinutes}/{goal.targetMinutes} min</span>
                  </div>
                  <button className="goal-delete" onClick={() => deleteGoal(goal.id)}>✕</button>
                </div>
                <div className="goal-progress-track">
                  <div
                    className="goal-progress-fill"
                    style={{ width: `${(goal.completedMinutes / goal.targetMinutes) * 100}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={goal.targetMinutes}
                  value={goal.completedMinutes}
                  onChange={(e) => updateProgress(goal.id, e.target.value)}
                  className="goal-slider"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="goals-section">
          <div className="goals-section-header">
            <h3>✅ Completadas</h3>
            <button className="clear-completed-btn" onClick={clearCompleted}>Limpiar</button>
          </div>
          <div className="goals-list">
            {completedGoals.map(goal => (
              <div key={goal.id} className="goal-card completed glass-panel">
                <div className="goal-card-top">
                  <button className="goal-check done" onClick={() => toggleGoal(goal.id)}>✅</button>
                  <div className="goal-info">
                    <span className="goal-subject">{goal.subject}</span>
                    <span className="goal-target">{goal.targetMinutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="goals-empty">
          <span className="goals-empty-icon">🎯</span>
          <p>No tienes metas aún. ¡Crea tu primera meta arriba!</p>
        </div>
      )}
    </div>
  );
};

export default StudyGoals;
