import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap, Target, Coffee } from 'lucide-react';

const FocusMode = ({ tasks }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'short-break', 'long-break'
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      // Play sound or notify
      alert(`${mode === 'work' ? 'Time for a break!' : 'Break over, back to work!'}`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') setTimeLeft(25 * 60);
    else if (mode === 'short-break') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'work') setTimeLeft(25 * 60);
    else if (newMode === 'short-break') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' ? (timeLeft / (25 * 60)) : (mode === 'short-break' ? timeLeft / (5 * 60) : timeLeft / (15 * 60));

  return (
    <div className="focus-container glass-panel neon-box-glow">
      <div className="focus-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={24} color="var(--primary-accent)" />
          <h2>Deep Work Timer</h2>
        </div>
        <div className="mode-selector">
          <button className={mode === 'work' ? 'active' : ''} onClick={() => switchMode('work')}>Work</button>
          <button className={mode === 'short-break' ? 'active' : ''} onClick={() => switchMode('short-break')}>Break</button>
        </div>
      </div>

      <div className="focus-main">
        <div className="timer-display">
          <svg className="timer-svg" viewBox="0 0 100 100">
            <circle className="timer-bg" cx="50" cy="50" r="45" />
            <circle 
              className="timer-progress" 
              cx="50" cy="50" r="45" 
              style={{ strokeDashoffset: 282.7 * (1 - progress) }}
            />
          </svg>
          <div className="timer-text">
            <span className="time">{formatTime(timeLeft)}</span>
            <span className="mode-label">{mode === 'work' ? 'Stay Focused' : 'Recharge'}</span>
          </div>
        </div>

        <div className="timer-controls">
          <button className="control-btn secondary" onClick={resetTimer}><RotateCcw size={20} /></button>
          <button className="control-btn primary" onClick={toggleTimer}>
            {isActive ? <Pause size={32} /> : <Play size={32} style={{marginLeft:'4px'}} />}
          </button>
          <button className="control-btn secondary" disabled><Target size={20} /></button>
        </div>
      </div>

      <div className="focus-task-selector">
        <label className="input-label">Currently Focusing On:</label>
        <select 
          className="modern-input" 
          value={selectedTask?._id || ''} 
          onChange={(e) => setSelectedTask(tasks.find(t => t._id === e.target.value))}
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <option value="">Select a task to focus on...</option>
          {tasks.filter(t => !t.completed).map(task => (
            <option key={task._id} value={task._id}>{task.title}</option>
          ))}
        </select>
        {selectedTask && (
          <div className="selected-task-info">
             <div className="priority-dot" style={{ background: {low:'#00ff88', medium:'#ffb800', high:'#ff7e00', urgent:'#ff4e4e'}[selectedTask.priority] }}></div>
             <span>{selectedTask.title}</span>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .focus-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          align-items: center;
          text-align: center;
        }
        .focus-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mode-selector {
          background: rgba(0,0,0,0.3);
          padding: 4px;
          border-radius: 10px;
          display: flex;
          gap: 4px;
        }
        .mode-selector button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 6px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .mode-selector button.active {
          background: var(--primary-accent);
          color: white;
        }
        
        .timer-display {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .timer-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .timer-bg {
          fill: none;
          stroke: rgba(255,255,255,0.05);
          stroke-width: 4;
        }
        .timer-progress {
          fill: none;
          stroke: var(--primary-accent);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 282.7;
          transition: stroke-dashoffset 1s linear;
        }
        .timer-text {
          display: flex;
          flex-direction: column;
          z-index: 1;
        }
        .time {
          font-size: 4rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          letter-spacing: -2px;
        }
        .mode-label {
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        .timer-controls {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .control-btn.primary {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-accent);
          border: none;
          color: #030805;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
        }
        .control-btn.primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(255, 184, 0, 0.6);
        }
        .control-btn.secondary {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-secondary);
        }
        .control-btn.secondary:hover {
          background: rgba(255,255,255,0.1);
          color: var(--text-primary);
        }
        .control-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .focus-task-selector {
          width: 100%;
          text-align: left;
        }
        .selected-task-info {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          font-size: 0.9rem;
        }
        .priority-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default FocusMode;
