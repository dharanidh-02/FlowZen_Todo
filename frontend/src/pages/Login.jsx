import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn, Cpu, Calendar, BarChart3, ChevronLeft, ChevronRight, Zap, Target, Sparkles, Leaf, Wind } from 'lucide-react';
import API_BASE from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      }, { withCredentials: true });
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Cpu size={32} />,
      title: "AI Task Assistant",
      desc: "Break down tasks & auto-suggest deadlines",
      color: "#00ff88"
    },
    {
      icon: <Calendar size={32} />,
      title: "Smart Calendar",
      desc: "Drag & drop tasks onto your schedule",
      color: "#ffb800"
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Productivity Insights",
      desc: "Track your trends & boost productivity",
      color: "#00ff88"
    },
    {
      icon: <Leaf size={32} />,
      title: "Sustainable Focus",
      desc: "Grow your habits in a green ecosystem",
      color: "#ffb800"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % features.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="neon-background" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '100vh' }}>
      <div className="star-field"></div>
      <div className="bokeh">
        {[...Array(15)].map((_, i) => (
          <span key={i} style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            width: `${10 + Math.random() * 30}px`,
            height: `${10 + Math.random() * 30}px`,
            background: i % 2 === 0 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 184, 0, 0.1)'
          }}></span>
        ))}
      </div>
      
      {/* Logo Section */}
      <div style={{ zIndex: 10, display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #00ff88, #ffb800)', 
          padding: '12px', 
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)'
        }}>
          <Wind size={32} color="#030805" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', color: 'white' }}>
          Flow<span style={{ color: '#00ff88' }}>Zen</span>
        </h1>
      </div>

      {/* Login Card */}
      <div className="auth-card" style={{ width: '100%', maxWidth: '420px', padding: '60px 45px', marginBottom: '50px', zIndex: 10 }}>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail size={20} color="rgba(0,255,136,0.3)" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: '15px' }}>
            <Lock size={20} color="rgba(255,184,0,0.3)" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '35px' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot Password?</a>
          </div>
          
          {error && <p className="error-message" style={{ marginBottom: '20px' }}>{error}</p>}
          
          <button type="submit" className="auth-button" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Entering...' : 'Login'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '35px', color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#00ff88', fontWeight: 800, textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>

      {/* 3D Feature Slider */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '30px', width: '100%', justifyContent: 'center', perspective: '1000px' }}>
          {features.map((f, i) => {
             let diff = i - currentSlide;
             if (diff > features.length / 2) diff -= features.length;
             if (diff < -features.length / 2) diff += features.length;
             const isActive = i === currentSlide;
             const isVisible = Math.abs(diff) <= 1;
             if (!isVisible) return null;

             return (
              <div 
                key={i} 
                className="feature-mini-card" 
                onClick={() => setCurrentSlide(i)}
                style={{ 
                  opacity: isActive ? 1 : 0.2,
                  transform: `translateX(${diff * 20}px) scale(${isActive ? 1.1 : 0.85}) rotateY(${diff * 15}deg)`,
                  zIndex: isActive ? 5 : 2,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isActive ? `1px solid ${f.color}55` : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isActive ? `0 20px 40px ${f.color}11` : 'none',
                  cursor: 'pointer'
                }}
              >
                <div className="feature-icon-wrapper" style={{ color: f.color, background: `${f.color}08`, padding: '20px' }}>
                  {f.icon}
                </div>
                <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{f.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
             );
          })}
        </div>

        <button onClick={prevSlide} style={{ position: 'absolute', left: '-80px', top: '35%', background: 'transparent', border: 'none', color: '#00ff88', cursor: 'pointer', opacity: 0.3 }}>
          <ChevronLeft size={56} strokeWidth={1} />
        </button>
        <button onClick={nextSlide} style={{ position: 'absolute', right: '-80px', top: '35%', background: 'transparent', border: 'none', color: '#ffb800', cursor: 'pointer', opacity: 0.3 }}>
          <ChevronRight size={56} strokeWidth={1} />
        </button>

        <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
          {features.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              style={{ 
                width: i === currentSlide ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '10px', 
                background: i === currentSlide ? '#00ff88' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.4s',
                boxShadow: i === currentSlide ? '0 0 10px #00ff88' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
