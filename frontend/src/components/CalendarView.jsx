import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Plus } from 'lucide-react';

const CalendarView = ({ tasks, onTaskClick, onDateClick }) => {
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClickInternal = (dateStr) => {
    setCurrentDate(new Date(dateStr));
    if (view === 'month' || view === 'week') {
      setView('day');
    }
    if (onDateClick) onDateClick(dateStr);
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const days = [];
    // Padding for empty days at start
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => {
        if (!t.due_date) return false;
        const taskDate = new Date(t.due_date).toISOString().split('T')[0];
        return taskDate === dateStr;
      });

      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`} onClick={() => handleDateClickInternal(dateStr)}>
          <span className="day-number">{day}</span>
          <div className="task-dots">
            {dayTasks.map(t => (
              <div 
                key={t._id} 
                className={`task-dot ${t.completed ? 'completed' : ''}`} 
                onClick={(e) => { e.stopPropagation(); onTaskClick(t); }}
                title={t.title}
              ></div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="month-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="weekday-header">{d}</div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    // Basic week view logic
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dateStr = day.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.due_date && new Date(t.due_date).toISOString().split('T')[0] === dateStr);
        
        days.push(
            <div key={i} className="week-day-column" onClick={() => handleDateClickInternal(dateStr)}>
                <div className="week-day-header">
                    <span>{day.toLocaleString('default', { weekday: 'short' })}</span>
                    <strong>{day.getDate()}</strong>
                </div>
                <div className="week-day-content">
                    {dayTasks.map(t => (
                        <div key={t._id} className={`week-task ${t.completed ? 'completed' : ''}`} onClick={(e) => {e.stopPropagation(); onTaskClick(t);}}>
                            {t.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return <div className="week-grid">{days}</div>;
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayTasks = tasks.filter(t => t.due_date && new Date(t.due_date).toISOString().split('T')[0] === dateStr);

    return (
        <div className="day-view">
            <h3 style={{marginBottom:'20px'}}>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <div className="day-tasks-list">
                {dayTasks.length === 0 ? (
                    <p style={{color:'var(--text-secondary)'}}>No tasks for this day.</p>
                ) : (
                    dayTasks.map(t => (
                        <div key={t._id} className={`day-task-item modern-input ${t.completed ? 'completed' : ''}`} onClick={() => onTaskClick(t)}>
                            <div style={{fontWeight:600}}>{t.title}</div>
                            {t.description && <div style={{fontSize:'0.85rem', opacity:0.7}}>{t.description}</div>}
                        </div>
                    ))
                )}
                <button className="modern-button" style={{marginTop:'24px'}} onClick={() => onDateClick(dateStr)}>
                    <Plus size={18} /> Add Mission
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="calendar-container glass-panel">
      <div className="calendar-header">
        <div className="current-month">
          <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <div className="nav-btns">
            <button onClick={prevMonth}><ChevronLeft size={20} /></button>
            <button onClick={nextMonth}><ChevronRight size={20} /></button>
          </div>
        </div>
        
        <div className="view-selector">
          <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Month</button>
          <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Week</button>
          <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Day</button>
        </div>
      </div>

      <div className="calendar-body">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>

      <style jsx="true">{`
        .calendar-container {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .current-month {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .current-month h2 {
          font-size: 1.4rem;
          font-weight: 700;
          min-width: 180px;
        }
        .nav-btns {
          display: flex;
          gap: 8px;
        }
        .nav-btns button {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btns button:hover {
          background: rgba(0, 255, 136, 0.2);
          border-color: var(--primary-accent);
        }
        .view-selector {
          background: rgba(0,0,0,0.3);
          padding: 4px;
          border-radius: 8px;
          display: flex;
        }
        .view-selector button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 6px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .view-selector button.active {
          background: var(--primary-accent);
          color: #030805;
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
        }
        
        .month-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          flex: 1;
        }
        .weekday-header {
          text-align: center;
          padding: 10px;
          font-weight: 700;
          color: var(--primary-accent);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .calendar-day {
          aspect-ratio: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .calendar-day:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .calendar-day.today {
          border: 2px solid var(--secondary-accent);
          background: rgba(255, 184, 0, 0.05);
        }
        .day-number {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .calendar-day.today .day-number {
            color: var(--secondary-accent);
        }
        .task-dots {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: auto;
        }
        .task-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-accent);
          box-shadow: 0 0 8px var(--primary-accent);
        }
        .task-dot.completed {
          background: var(--success-color);
          box-shadow: 0 0 8px var(--success-color);
          opacity: 0.5;
        }

        .week-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 12px;
            min-height: 400px;
        }
        .week-day-column {
            background: rgba(255,255,255,0.02);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(255,255,255,0.05);
            cursor: pointer;
        }
        .week-day-header {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            flex-direction: column;
        }
        .week-day-header strong {
            font-size: 1.2rem;
            color: var(--primary-accent);
        }
        .week-day-content {
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
        }
        .week-task {
            font-size: 0.8rem;
            padding: 6px;
            background: rgba(0, 255, 136, 0.1);
            border-left: 3px solid var(--primary-accent);
            border-radius: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .week-task.completed {
            background: rgba(0, 255, 136, 0.05);
            border-color: var(--success-color);
            text-decoration: line-through;
            opacity: 0.7;
        }

        .day-tasks-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .day-task-item {
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .day-task-item:hover {
            border-color: var(--primary-accent);
            background: rgba(0, 255, 136, 0.05);
        }
        .day-task-item.completed {
            opacity: 0.6;
            text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
