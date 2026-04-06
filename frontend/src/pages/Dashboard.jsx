import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, LogOut, Settings, UserCheck, Zap, Activity, ShieldCheck, 
  Flame, Plus, Trash2, CheckCircle, Circle, Pencil, Check, X, 
  ListTodo, CheckCircle2, Clock, TrendingUp, Calendar as CalendarIcon, 
  LayoutDashboard, Layout, Target, Flag, Leaf, Wind
} from 'lucide-react';
import TaskModal from '../components/TaskModal';
import CalendarView from '../components/CalendarView';
import KanbanBoard from '../components/KanbanBoard';
import FocusMode from '../components/FocusMode';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'calendar', 'kanban', 'focus'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({ username: '', email: '', dept: '', year: '', age: '' });
  const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchTodos();
  }, [navigate]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/getuser', { withCredentials: true });
      const userData = response.data.user || response.data;
      setUser(userData);
      setNotes(userData.notes || '');
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        dept: userData.dept || '',
        year: userData.year || '',
        age: userData.age || ''
      });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos', { withCredentials: true });
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg({ type: '', text: '' });
    try {
      const response = await axios.patch('http://localhost:5000/api/user/updateuser', profileData, { withCredentials: true });
      if (response.status === 200) {
        setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
        setUser({ ...user, ...profileData });
        setTimeout(() => setShowProfile(false), 2000);
      }
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const saveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await axios.patch('http://localhost:5000/api/user/updateuser', { notes }, { withCredentials: true });
    } catch (err) {
      console.error('Failed to save notes', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

  // Task Management logic
  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask && selectedTask._id) {
        // Update
        const res = await axios.put(`http://localhost:5000/api/todos/${selectedTask._id}`, taskData, { withCredentials: true });
        setTodos(todos.map(t => t._id === selectedTask._id ? res.data : t));
      } else {
        // Create
        const res = await axios.post('http://localhost:5000/api/todos', taskData, { withCredentials: true });
        setTodos([res.data, ...todos]);
      }
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Failed to save task', err);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/todos', { title: newTodo }, { withCredentials: true });
      setTodos([res.data, ...todos]);
      setNewTodo('');
    } catch(err) { console.error('Add failed', err); }
  };

  const toggleTodo = async (id, currentStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !currentStatus }, { withCredentials: true });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch(err) { console.error('Toggle failed', err); }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, { withCredentials: true });
      setTodos(todos.filter(t => t._id !== id));
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch(err) { console.error('Delete failed', err); }
  };

  const openEditModal = (todo) => {
    setSelectedTask(todo);
    setIsModalOpen(true);
  };

  const openCreateModal = (dateStr = null) => {
    setSelectedTask(dateStr ? { due_date: dateStr } : null);
    setIsModalOpen(true);
  };

  // Analytics logic
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const priorityColors = {
    low: '#00ff88',
    medium: '#ffb800',
    high: '#ff7e00',
    urgent: '#ff4e4e'
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--primary-accent)' }}>
        <Zap className="spin" size={40} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%', minHeight: '100vh' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', marginBottom: '32px', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'var(--primary-accent)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wind size={20} color="#030805" />
              </div>
              Flow<span style={{color:'var(--primary-accent)'}}>Zen</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Hi, <span style={{color:'var(--secondary-accent)', fontWeight:600}}>{user?.username}</span></p>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '12px' }}>
            {[
              { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Stats' },
              { id: 'calendar', icon: <CalendarIcon size={18} />, label: 'Calendar' },
              { id: 'kanban', icon: <Layout size={18} />, label: 'Board' },
              { id: 'focus', icon: <Target size={18} />, label: 'Focus' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id)} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeView === item.id ? 'var(--primary-accent)' : 'transparent',
                  color: activeView === item.id ? '#030805' : 'var(--text-secondary)',
                  boxShadow: activeView === item.id ? '0 0 15px rgba(0, 255, 136, 0.4)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {item.icon}
                <span style={{ fontWeight: 700, display: window.innerWidth > 1000 ? 'inline' : 'none' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setShowProfile(!showProfile)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: showProfile ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%', transition: 'all 0.3s' }}>
              <Settings size={20} color={showProfile ? '#030805' : 'var(--text-secondary)'} />
            </div>
          </button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={20} />
            <span style={{ fontWeight: 600, fontSize:'1rem' }}>Exit</span>
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '32px', flex: 1, flexWrap: 'wrap' }}>
        
        {/* Main Content Area */}
        <main style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {showProfile && (
            <div className="glass-panel neon-box-glow" style={{ padding: '24px', borderLeft: '4px solid var(--secondary-accent)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="var(--secondary-accent)" /> Update Profile
              </h2>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize:'0.85rem', color:'var(--text-secondary)', display:'block', marginBottom:'8px' }}>Username</label>
                    <input type="text" name="username" className="modern-input" value={profileData.username} onChange={handleProfileChange} />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.85rem', color:'var(--text-secondary)', display:'block', marginBottom:'8px' }}>Email</label>
                    <input type="email" name="email" className="modern-input" value={profileData.email} disabled style={{ opacity: 0.5 }} />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.85rem', color:'var(--text-secondary)', display:'block', marginBottom:'8px' }}>Department</label>
                    <input type="text" name="dept" className="modern-input" value={profileData.dept} onChange={handleProfileChange} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize:'0.85rem', color:'var(--text-secondary)', display:'block', marginBottom:'8px' }}>Year</label>
                      <input type="number" name="year" className="modern-input" value={profileData.year} onChange={handleProfileChange} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize:'0.85rem', color:'var(--text-secondary)', display:'block', marginBottom:'8px' }}>Age</label>
                      <input type="number" name="age" className="modern-input" value={profileData.age} onChange={handleProfileChange} />
                    </div>
                  </div>
                </div>
                {updateMsg.text && <p style={{ color: updateMsg.type === 'error' ? 'var(--danger-color)' : 'var(--success-color)', marginBottom: '16px', fontSize: '0.9rem' }}>{updateMsg.text}</p>}
                <button type="submit" className="modern-button" style={{ maxWidth: '200px', background: 'var(--primary-accent)', color: '#030805' }}>Save Changes</button>
              </form>
            </div>
          )}

          {activeView === 'dashboard' && (
            <>
              {/* Feature 1: Task Analytics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                 <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ color: 'var(--primary-accent)' }}><ListTodo size={28} /></div>
                    <div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{totalTasks}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Tasks</p>
                    </div>
                 </div>
                 <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ color: 'var(--primary-accent)' }}><CheckCircle2 size={28} /></div>
                    <div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{completedTasks}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completed</p>
                    </div>
                 </div>
                 <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ color: 'var(--danger-color)' }}><Clock size={28} /></div>
                    <div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{pendingTasks}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending</p>
                    </div>
                 </div>
                 <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ color: 'var(--secondary-accent)' }}><TrendingUp size={28} /></div>
                    <div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{completionRate}%</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completion Rate</p>
                    </div>
                 </div>
              </div>

              {/* Feature 2: Quick Notes */}
              <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Leaf size={20} color="var(--primary-accent)" /> 
                  Ideas & Notes
                  <button 
                    onClick={saveNotes} 
                    className="modern-button"
                    style={{ marginLeft: 'auto', width: 'auto', padding: '6px 16px', fontSize: '0.85rem' }}
                  >
                    {isSavingNotes ? 'Saving...' : 'Sync Notes'}
                  </button>
                </h2>
                <textarea 
                  className="modern-input" 
                  placeholder="Jot down quick thoughts here..."
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ flex: 1, minHeight: '200px', resize: 'vertical', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0, 255, 136, 0.1)' }}
                />
              </div>
            </>
          )}

          {activeView === 'calendar' && (
            <CalendarView 
                tasks={todos} 
                onTaskClick={openEditModal} 
                onDateClick={(date) => openCreateModal(date)} 
            />
          )}

          {activeView === 'kanban' && (
            <KanbanBoard 
              tasks={todos} 
              onTaskClick={openEditModal}
              onTaskUpdate={handleSaveTask}
            />
          )}

          {activeView === 'focus' && (
            <FocusMode tasks={todos} />
          )}

        </main>

        {/* Sidebar: Interactive Todo List */}
        <aside className="glass-panel" style={{ flex: '0 0 350px', padding: '24px', display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Up Next</h2>
            <button onClick={() => openCreateModal()} style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', cursor: 'pointer' }}>
                <Plus size={20} />
            </button>
          </div>
          
          <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input 
              type="text" 
              className="modern-input" 
              placeholder="What's on your mind?" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              style={{ flex: 1, border: '1px solid rgba(0, 255, 136, 0.1)' }}
            />
            <button type="submit" className="modern-button" style={{ width: '48px', padding: '0' }}>
              <Plus size={20} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todos.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0', border: '2px dashed rgba(0, 255, 136, 0.1)', borderRadius: '8px' }}>
                It's quiet in here. Start adding your tasks!
              </p>
            ) : (
              todos.map(todo => (
                <div 
                  key={todo._id} 
                  style={{ 
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px',
                    background: todo.completed ? 'rgba(0, 255, 136, 0.03)' : 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid ' + (todo.completed ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.05)'), 
                    borderLeft: `4px solid ${priorityColors[todo.priority || 'medium']}`,
                    borderRadius: '8px', transition: 'all 0.3s ease',
                    opacity: todo.completed ? 0.7 : 1
                  }}
                >
                  <div 
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', flex: 1 }} 
                    onClick={() => openEditModal(todo)}
                  >
                    <div 
                        style={{ marginTop: '2px' }}
                        onClick={(e) => { e.stopPropagation(); toggleTodo(todo._id, todo.completed); }}
                    >
                      {todo.completed ? <CheckCircle size={20} color="var(--primary-accent)" /> : <Circle size={20} color="var(--text-secondary)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.4, wordBreak: 'break-word', display: 'block', fontWeight: 500 }}>
                          {todo.title}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                          {todo.due_date && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--secondary-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <CalendarIcon size={12} /> {new Date(todo.due_date).toLocaleDateString()}
                              </span>
                          )}
                          {todo.subtasks?.length > 0 && (
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ListTodo size={12} /> {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length}
                             </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                          {todo.tags?.map(tag => (
                            <span key={tag.name} style={{ background: tag.color + '11', color: tag.color, fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid ' + tag.color + '33' }}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', opacity: 0.7 }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(todo); }} 
                      style={{ display: 'flex', background: 'transparent', border: 'none', color: 'var(--secondary-accent)', cursor: 'pointer', padding: '4px' }}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteTask(todo._id); }} 
                      style={{ display: 'flex', background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px' }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

      </div>
      
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
        onSave={handleSaveTask} 
        onDelete={handleDeleteTask} 
      />

      <style jsx="true">{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
