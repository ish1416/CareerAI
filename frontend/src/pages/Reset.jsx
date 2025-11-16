import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Logo from '../components/Logo.jsx';

export default function Reset() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Reset token missing. Use the link from your email.');
      return;
    }
    if (password.length < 8) {
      setError('Use a stronger password (minimum 8 characters).');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset', { token, password });
      navigate('/login');
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-wrap">
        <form onSubmit={onSubmit} className="card auth-card form" aria-label="Reset password form">
          <div className="auth-header">
            <Logo size={56} variant="accent" />
            <h2>Reset Password</h2>
            <p className="sub">Enter and confirm your new password</p>
          </div>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirm">Confirm Password</label>
          <input
            id="confirm"
            type="password"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn cta gradient" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
      <p className="sub auth-sub">
        Back to <Link to="/login">Login</Link> or <Link to="/register">Register</Link>
      </p>
    </>
  );
}