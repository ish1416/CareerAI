import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import api from '../utils/api';
import { useToast } from '../components/Toast.jsx';

export default function Register() {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'error') {
      showToast('Google sign-up failed. Please try again.', 'error');
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.ok) {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (u?.emailVerified) navigate('/dashboard');
      else navigate('/verify-email');
    }
    else {
      const msg = res.error || 'Register failed';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const continueWithGoogle = async () => {
    try {
      await api.get('/health', { timeout: 4000 });
      window.location.href = `${API_BASE}/auth/google`;
    } catch (e) {
      const msg = e?.response?.data?.error || 'Backend unavailable. Start API server and retry.';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '32px 24px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Logo size={48} variant="accent" />
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '12px 0 4px', color: 'var(--text)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-soft)', margin: 0, fontSize: '14px' }}>Join CareerAI today</p>
        </div>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: 'var(--text)', fontSize: '14px' }}>Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--surface)',
                color: 'var(--text)',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: 'var(--text)', fontSize: '14px' }}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--surface)',
                color: 'var(--text)',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: 'var(--text)', fontSize: '14px' }}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--surface)',
                color: 'var(--text)',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              borderRadius: '8px',
              padding: '10px',
              color: 'var(--error)',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', margin: '8px 0' }}>
            or
          </div>
          
          <button 
            type="button" 
            onClick={continueWithGoogle}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Continue with Google
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-soft)' }}>
          Already have an account? <Link to="/login" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}