import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, UserPlus, GraduationCap, Calendar, FileDigit, Zap, Wind } from 'lucide-react';
import API_BASE from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    Department: '',
    year: '',
    Age: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        dept: formData.Department,
        year: formData.year,
        age: formData.Age
      };
      
      const response = await axios.post(`${API_BASE}/auth/register`, payload);
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neon-background" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="star-field"></div>
      <div className="bokeh">
        {[...Array(10)].map((_, i) => (
          <span key={i} style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 10}s`,
            width: `${15 + Math.random() * 20}px`,
            height: `${15 + Math.random() * 20}px`,
            background: 'rgba(255, 184, 0, 0.05)'
          }}></span>
        ))}
      </div>
      
      {/* Logo Section */}
      <div style={{ zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #00ff88, #ffb800)', 
          padding: '10px', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)'
        }}>
          <Wind size={28} color="#030805" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>
          <span style={{ color: 'white' }}>Flow</span>
          <span style={{ color: '#00ff88' }}>Zen</span>
        </h1>
      </div>

      <div className="auth-card" style={{ width: '100%', maxWidth: '500px', padding: '40px', zIndex: 10 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Initialize Your Hub</h2>
        
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <User size={18} color="rgba(0,255,136,0.3)" />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <Mail size={18} color="rgba(255,184,0,0.3)" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <Lock size={18} color="rgba(0,255,136,0.3)" />
            <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <GraduationCap size={18} color="rgba(255,184,0,0.3)" />
            <input type="text" name="Department" placeholder="Department" value={formData.Department} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <Calendar size={18} color="rgba(0,255,136,0.3)" />
              <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleChange} required />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <FileDigit size={18} color="rgba(255,184,0,0.3)" />
              <input type="number" name="Age" placeholder="Age" value={formData.Age} onChange={handleChange} required />
            </div>
          </div>
          
          {error && <p className="error-message" style={{ marginBottom: '20px' }}>{error}</p>}
          
          <button type="submit" className="auth-button" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '30px', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#00ff88', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
