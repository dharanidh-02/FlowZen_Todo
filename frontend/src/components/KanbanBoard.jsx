import React from 'react';
import { MoreVertical, Plus, Trash2, Clock, CheckCircle2, ListTodo, Circle } from 'lucide-react';

const KanbanBoard = ({ tasks, onTaskClick, onTaskUpdate }) => {
  const columns = [
    { id: 'todo', title: 'To Do', icon: <Circle size={18} color="var(--text-secondary)" /> },
    { id: 'in-progress', title: 'In Progress', icon: <Clock size={18} color="var(--secondary-accent)" /> },
    { id: 'completed', title: 'Completed', icon: <CheckCircle2 size={18} color="var(--primary-accent)" /> }
  ];

  const getTasksByStatus = (status) => {
    if (status === 'completed') return tasks.filter(t => t.completed);
    // For 'in-progress', we'll use a simple heuristic for now (e.g., if it has subtasks and some are done)
    // In a real app, we'd add a 'status' field. For now, let's treat anything not completed as 'todo' 
    // unless the user moves it. 
    // Since we don't have a status field yet, I'll add one to the model in the next step if needed, 
    // but I'll use the 'is_habit' or just local logic for now.
    // Actually, I'll assume tasks not completed are 'todo'.
    if (status === 'todo') return tasks.filter(t => !t.completed);
    return [];
  };

  const priorityColors = {
    low: '#00ff88',
    medium: '#ffb800',
    high: '#ff7e00',
    urgent: '#ff4e4e'
  };

  return (
    <div className="kanban-container">
      <div className="kanban-grid">
        {columns.map(col => (
          <div key={col.id} className="kanban-column glass-panel">
            <div className="column-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {col.icon}
                <h3>{col.title}</h3>
                <span className="task-count">{getTasksByStatus(col.id).length}</span>
              </div>
              <button className="icon-btn"><MoreVertical size={16} /></button>
            </div>

            <div className="column-tasks">
              {getTasksByStatus(col.id).map(task => (
                <div 
                  key={task._id} 
                  className="kanban-card neon-box-glow" 
                  onClick={() => onTaskClick(task)}
                >
                  <div className="priority-tag" style={{ background: priorityColors[task.priority] }}></div>
                  <h4 className="card-title">{task.title}</h4>
                  {task.description && <p className="card-desc">{task.description}</p>}
                  
                  <div className="card-footer">
                    <div className="tags-list">
                      {task.tags?.slice(0, 2).map(tag => (
                        <span key={tag.name} className="tag-pill" style={{ color: tag.color, border: `1px solid ${tag.color}44`, background: `${tag.color}11` }}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    {task.subtasks?.length > 0 && (
                      <div className="subtask-progress">
                        <ListTodo size={12} />
                        <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button className="modern-button secondary" onClick={() => onTaskClick(null)} style={{ marginTop: '12px', borderStyle: 'dashed' }}>
                <Plus size={16} /> Add Mission
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx="true">{`
        .kanban-container {
          height: 100%;
          overflow-x: auto;
          padding-bottom: 20px;
        }
        .kanban-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(300px, 1fr));
          gap: 24px;
          height: 100%;
          min-width: 950px;
        }
        .kanban-column {
          background: rgba(255,255,255,0.02);
          display: flex;
          flex-direction: column;
          height: fit-content;
          max-height: 80vh;
        }
        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .column-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .task-count {
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .column-tasks {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }
        .kanban-card {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .kanban-card:hover {
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.2);
        }
        .priority-tag {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }
        .card-title {
          font-size: 1rem;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tags-list {
          display: flex;
          gap: 6px;
        }
        .tag-pill {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .subtask-progress {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .add-task-btn {
          margin-top: 8px;
          background: transparent;
          border: 1px dashed rgba(255,255,255,0.2);
          color: var(--text-secondary);
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .add-task-btn:hover {
          border-style: solid;
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
        }
        .icon-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          opacity: 0.6;
        }
        .icon-btn:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;
