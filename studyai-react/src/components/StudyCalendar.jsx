import React, { useState } from 'react';

const StudyCalendar = ({ recentHabits = [] }) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getLocalDateString = (dateObjOrStr) => {
    const d = new Date(dateObjOrStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Build a map of date -> total minutes from the habits
  const dateMap = {};
  recentHabits.forEach(h => {
    const date = getLocalDateString(h.studyDate);
    dateMap[date] = (dateMap[date] || 0) + h.durationMinutes;
  });

  // Generate last 91 days (13 weeks)
  const days = [];
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getLocalDateString(d);
    days.push({ date: key, minutes: dateMap[key] || 0, dayOfWeek: d.getDay() });
  }

  const getIntensity = (minutes) => {
    if (minutes === 0) return 0;
    if (minutes < 15) return 1;
    if (minutes < 30) return 2;
    if (minutes < 60) return 3;
    return 4;
  };

  // Group by weeks
  const weeks = [];
  let currentWeek = [];
  // Pad first week
  if (days.length > 0) {
    for (let i = 0; i < days[0].dayOfWeek; i++) {
      currentWeek.push(null);
    }
  }
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const validDay = week.find(d => d !== null);
    if (validDay) {
      const month = new Date(validDay.date).getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        monthLabels.push({ index: wi, label: monthNames[month] });
      }
    }
  });

  const handleMouseEnter = (day, e) => {
    if (!day) return;
    const rect = e.target.getBoundingClientRect();
    setTooltipData(day);
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
  };

  const totalMinutes = days.reduce((s, d) => s + d.minutes, 0);
  const activeDays = days.filter(d => d.minutes > 0).length;

  return (
    <div className="calendar-container">
      <div className="calendar-header-row">
        <h2>📅 Actividad de Estudio</h2>
        <div className="calendar-summary">
          <span>{activeDays} días activos</span>
          <span>·</span>
          <span>{totalMinutes} min totales</span>
        </div>
      </div>

      <div className="calendar-grid-wrapper">
        <div className="calendar-day-labels">
          <span></span><span>Lun</span><span></span><span>Mié</span><span></span><span>Vie</span><span></span>
        </div>
        <div className="calendar-scroll">
          <div className="calendar-month-labels">
            {monthLabels.map((m, i) => (
              <span key={i} style={{ gridColumnStart: m.index + 1 }}>{m.label}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="calendar-week">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`calendar-cell intensity-${day ? getIntensity(day.minutes) : 'empty'}`}
                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                    onMouseLeave={() => setTooltipData(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-legend">
        <span className="legend-label">Menos</span>
        <div className="calendar-cell intensity-0" />
        <div className="calendar-cell intensity-1" />
        <div className="calendar-cell intensity-2" />
        <div className="calendar-cell intensity-3" />
        <div className="calendar-cell intensity-4" />
        <span className="legend-label">Más</span>
      </div>

      {tooltipData && (
        <div className="calendar-tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          <strong>{tooltipData.date}</strong>
          <span>{tooltipData.minutes > 0 ? `${tooltipData.minutes} min estudiados` : 'Sin actividad'}</span>
        </div>
      )}
    </div>
  );
};

export default StudyCalendar;
