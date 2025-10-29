import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Logo from '../components/Logo.jsx';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await api.post('/auth/forgot', { email });
      setStatus('If your account exists, we sent a reset link to your email.');
    } catch (e) {
      setStatus(e?.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-wrap">
        <form onSubmit={onSubmit} className="card auth-card form" aria-label="Forgot password form">
          <div className="auth-header">
            <Logo size={56} />
            <h2>Forgot Password</h2>
            <p className="sub">Well email you a reset link</p>
          </div>
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
          {status && <p className="form-info" role="status">{status}</p>}
          <div className="form-actions">
            <button type="submit" className="btn cta gradient" disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
      <p className="sub auth-sub">
        Remembered your password? <Link to="/login">Login</Link>
      </p>
    </>
  );
}