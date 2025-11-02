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
          <Logo size={48} />
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '12px 0 4px', color: 'var(--text)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-soft)', margin: 0, fontSize: '14px' }}>Sign in to your account</p>
        </div>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text)' }}>Email</label>
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
                width: '100%',
                padding: '10px 14px',
                border: `1px solid ${validationErrors.email ? 'var(--error)' : 'var(--border)'}`,
                borderRadius: '12px',
                fontSize: '16px',
                background: 'var(--surface)',
                color: 'var(--text)',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              required
            />
            {validationErrors.email && (
              <div style={{ 
                color: 'var(--error)', 
                fontSize: '14px', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={14} />
                {validationErrors.email}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text)' }}>Password</label>
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
                  width: '100%',
                  padding: '10px 40px 10px 14px',
                  border: `1px solid ${validationErrors.password ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {validationErrors.password && (
              <div style={{ 
                color: 'var(--error)', 
                fontSize: '14px', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
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
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color="var(--error)" />
              <span style={{ color: 'var(--error)', fontSize: '14px' }}>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isSubmitting || loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting || loading ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isSubmitting || loading ? (
              <SmartLoading message="Signing in..." size="small" />
            ) : (
              'Sign In'
            )}
          </button>
          
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', margin: '16px 0' }}>
            or
          </div>
          
          <button 
            type="button" 
            onClick={continueWithGoogle}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            Continue with Google
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-soft)' }}>
          Don't have an account? <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>Sign up</Link>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', color: 'var(--text-soft)' }}>
          Forgot your password? <Link to="/forgot" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>Reset it</Link>
        </div>
      </div>
    </div>
  );
}