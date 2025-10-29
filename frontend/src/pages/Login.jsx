import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import apiEnhanced from '../utils/apiEnhanced.js';
import { useToast } from '../components/Toast.jsx';
import { SmartLoading } from '../components/LoadingSystem.jsx';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, loading, retryCount } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'error') {
      showToast('Google sign-in failed. Please try again.', 'error');
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    const res = await login(email, password);
    
    if (res.ok) {
      showToast('Login successful!', 'success');
      const auth = JSON.parse(localStorage.getItem('careerai_auth') || '{}');
      if (auth.user?.emailVerified) {
        navigate('/dashboard');
      } else {
        navigate('/verify-email');
      }
    } else {
      setError(res.error);
      if (res.canRetry) {
        showToast(`${res.error} (Attempt ${retryCount + 1})`, 'error');
      } else {
        showToast(res.error, 'error');
      }
    }
    
    setIsSubmitting(false);
  };

  const continueWithGoogle = async () => {
    try {
      setIsSubmitting(true);
      await apiEnhanced.get('/health', { timeout: 4000 });
      window.location.href = `${API_BASE}/auth/google`;
    } catch (e) {
      const msg = e?.message || 'Unable to connect to authentication service';
      setError(msg);
      showToast(msg, 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-wrap">
        <form onSubmit={onSubmit} className="card auth-card form" aria-label="Login form">
          <div className="auth-header">
            <Logo size={56} />
            <h2>Login</h2>
            <p className="sub">Welcome back</p>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              style={{
                borderColor: validationErrors.email ? 'var(--error)' : undefined
              }}
              required
            />
            {validationErrors.email && (
              <div style={{ 
                color: 'var(--error)', 
                fontSize: 'var(--text-sm)', 
                marginTop: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}>
                <AlertCircle size={14} />
                {validationErrors.email}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                style={{
                  borderColor: validationErrors.password ? 'var(--error)' : undefined,
                  paddingRight: 'var(--space-8)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 'var(--space-2)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {validationErrors.password && (
              <div style={{ 
                color: 'var(--error)', 
                fontSize: 'var(--text-sm)', 
                marginTop: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}>
                <AlertCircle size={14} />
                {validationErrors.password}
              </div>
            )}
          </div>
          {error && (
            <div style={{
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              borderRadius: 'var(--radius)',
              padding: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <AlertCircle size={16} color="var(--error)" />
              <span style={{ color: 'var(--error)', fontSize: 'var(--text-sm)' }}>{error}</span>
            </div>
          )}
          
          <div className="form-actions" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button 
              type="submit" 
              className="btn cta gradient" 
              disabled={isSubmitting || loading}
              style={{ width: '100%' }}
            >
              {isSubmitting || loading ? (
                <SmartLoading message="Signing in..." size="small" />
              ) : (
                'Sign In'
              )}
            </button>
            
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              or
            </div>
            
            <button 
              type="button" 
              className="btn secondary" 
              onClick={continueWithGoogle}
              disabled={isSubmitting}
              style={{ width: '100%' }}
            >
              Continue with Google
            </button>
          </div>
        </form>
      </div>
      <p className="sub auth-sub">
        No account? <Link to="/register">Create one</Link> • Forgot your password? <Link to="/forgot">Reset it</Link>
      </p>
    </>
  );
}