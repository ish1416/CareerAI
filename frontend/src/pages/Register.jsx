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
    <> 
      <div className="auth-wrap">
        <form onSubmit={onSubmit} className="card auth-card form" aria-label="Register form">
          <div className="auth-header">
            <Logo size={56} />
            <h2>Create Account</h2>
            <p className="sub">Let’s get you started</p>
          </div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="submit" className="btn cta gradient" disabled={loading}>
              {loading ? 'Creating…' : 'Create Account'}
            </button>
            {/* Google OAuth */}
            <button type="button" className="btn small ghost" onClick={continueWithGoogle}>Continue with Google</button>
          </div>
        </form>
      </div>
      <p className="sub auth-sub">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </>
  );
}