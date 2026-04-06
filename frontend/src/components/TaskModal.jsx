import React, { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, CheckCircle2, Trash2, Tag, ListTodo, Plus, Flag } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, task, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    completed: false,
    priority: 'medium',
    tags: [],
    subtasks: [],
    is_habit: false
  });

  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        tags: task.tags || [],
        subtasks: task.subtasks || [],
        is_habit: task.is_habit || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        completed: false,
        priority: 'medium',
        tags: [],
        subtasks: [],
        is_habit: false
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.some(t => t.name === newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, { name: newTag.trim(), color: getRandomColor() }]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagName) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t.name !== tagName)
    });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData({
        ...formData,
        subtasks: [...formData.subtasks, { title: newSubtask.trim(), completed: false }]
      });
      setNewSubtask('');
    }
  };

  const toggleSubtask = (index) => {
    const updatedSubtasks = [...formData.subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const removeSubtask = (index) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter((_, i) => i !== index)
    });
  };

  const getRandomColor = () => {
    const colors = ['#B026FF', '#00D4FF', '#00FF88', '#FF4E4E', '#FFB800'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const priorityColors = {
    low: '#00FF88',
    medium: '#00D4FF',
    high: '#FFB800',
    urgent: '#FF4E4E'
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content neon-box-glow" style={{ width: '100%', maxWidth: '600px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)', fontWeight: 700 }}>
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="input-label">Title</label>
            <input 
              type="text" 
              className="modern-input" 
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="input-label">
                <Flag size={14} style={{ marginRight: '6px' }} /> 
                Priority
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['low', 'medium', 'high', 'urgent'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: '6px',
                      border: '1px solid ' + (formData.priority === p ? priorityColors[p] : 'rgba(255,255,255,0.1)'),
                      background: formData.priority === p ? priorityColors[p] + '22' : 'transparent',
                      color: formData.priority === p ? priorityColors[p] : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label">
                <Calendar size={14} style={{ marginRight: '6px' }} /> 
                Due Date
              </label>
              <input 
                type="date" 
                className="modern-input" 
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div>
            <label className="input-label">
              <AlignLeft size={14} style={{ marginRight: '6px' }} /> 
              Description
            </label>
            <textarea 
              className="modern-input" 
              placeholder="Add details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div>
             <label className="input-label">
                <Tag size={14} style={{ marginRight: '6px' }} /> 
                Tags
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {formData.tags.map(tag => (
                  <span 
                    key={tag.name} 
                    style={{ 
                      background: tag.color + '22', 
                      color: tag.color, 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      border: '1px solid ' + tag.color + '44'
                    }}
                  >
                    {tag.name}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag.name)} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="New tag..." 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  style={{ height: '36px' }}
                />
                <button type="button" className="modern-button" style={{ width: '40px', padding: '0', height: '36px' }} onClick={addTag}>
                  <Plus size={16} />
                </button>
              </div>
          </div>

          <div>
            <label className="input-label">
              <ListTodo size={14} style={{ marginRight: '6px' }} /> 
              Subtasks
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {formData.subtasks.map((st, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                  <input 
                    type="checkbox" 
                    checked={st.completed} 
                    onChange={() => toggleSubtask(index)}
                    style={{ accentColor: 'var(--primary-accent)' }}
                  />
                  <span style={{ flex: 1, fontSize: '0.9rem', color: st.completed ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: st.completed ? 'line-through' : 'none' }}>
                    {st.title}
                  </span>
                  <X size={14} style={{ cursor: 'pointer', color: 'var(--danger-color)', opacity: 0.7 }} onClick={() => removeSubtask(index)} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="modern-input" 
                placeholder="Add subtask..." 
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                style={{ height: '36px' }}
              />
              <button type="button" className="modern-button" style={{ width: '40px', padding: '0', height: '36px' }} onClick={addSubtask}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', gap: '12px' }}>
            {task && (
              <button 
                type="button" 
                onClick={() => onDelete(task._id)}
                className="danger-button" 
                title="Delete Task"
                style={{ width: '44px', height: '44px' }}
              >
                <Trash2 size={20} />
              </button>
            )}
            <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
              <button type="button" onClick={onClose} className="modern-button secondary">
                Cancel
              </button>
              <button type="submit" className="modern-button" style={{ flex: 2 }}>
                {task ? 'Update Mission' : 'Create Mission'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          animation: modalSlideIn 0.3s ease-out;
        }
        @keyframes modalSlideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: var(--danger-color);
        }
        .input-label {
          display: flex;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default TaskModal;
