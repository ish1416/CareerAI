import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import Logo from '../components/Logo.jsx';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { user, reloadUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (user && user.emailVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((c) => (c > 1 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    if (sending || cooldown > 0) return;
    setError('');
    setMessage('');
    setSending(true);
    try {
      await api.post('/auth/resend-verification');
      setMessage(`Verification email sent${user?.email ? ` to ${user.email}` : ''}.`);
      setCooldown(30);
    } catch (e) {
      setError(e?.response?.data?.error || 'Unable to resend verification email');
    } finally {
      setSending(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return; // Prevent multiple calls
    setError('');
    setMessage('');
    setRefreshing(true);
    try {
      const { data } = await api.get('/user/profile');
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.emailVerified) {
          setMessage('Email verified! Redirecting to dashboard…');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
          return;
        }
      }
      setMessage('Still unverified. Please check your email and click the verification link.');
    } catch (e) {
      console.error('Refresh error:', e);
      setError(e?.response?.data?.error || 'Unable to refresh verification status');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="auth-wrap" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-subtle) 100%)' }}>
      <div className="card auth-card form" style={{ maxWidth: '480px', position: 'relative', overflow: 'hidden' }}>
        {/* Header */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'rgba(99,102,241,0.12)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--space-4)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <Logo size={48} variant="accent" />
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', margin: 'var(--space-2) 0' }}>
            Verify Your Email
          </h2>
          <p className="muted" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
            We've sent a secure verification link to
            {user?.email && (
              <span style={{ 
                display: 'block', 
                fontWeight: '600', 
                color: 'var(--primary)', 
                marginTop: 'var(--space-1)' 
              }}>
                {user.email}
              </span>
            )}
          </p>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="badge success" style={{ 
            width: '100%', 
            padding: 'var(--space-3)', 
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-2)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>{message}</span>
          </div>
        )}
        
        {error && (
          <div className="badge error" style={{ 
            width: '100%', 
            padding: 'var(--space-3)', 
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-2)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Instructions */}
        <div className="card" style={{ 
          background: 'var(--muted)', 
          padding: 'var(--space-4)', 
          marginBottom: 'var(--space-5)',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
            What's next?
          </h4>
          <ol style={{ 
            listStyle: 'none', 
            padding: '0', 
            margin: '0',
            display: 'grid',
            gap: 'var(--space-2)'
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{
                width: '20px',
                height: '20px',
                background: 'rgba(99,102,241,0.12)',
                color: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: '600'
              }}>1</span>
              <span className="text-sm">Check your email inbox</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{
                width: '20px',
                height: '20px',
                background: 'rgba(99,102,241,0.12)',
                color: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: '600'
              }}>2</span>
              <span className="text-sm">Click the verification link</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{
                width: '20px',
                height: '20px',
                background: 'rgba(99,102,241,0.12)',
                color: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: '600'
              }}>3</span>
              <span className="text-sm">Return here and refresh</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <button 
            onClick={handleResend} 
            disabled={sending || cooldown > 0} 
            className={cooldown > 0 ? 'btn ghost' : 'btn primary'}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
          >
            {sending ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                <span>Sending...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Wait {cooldown}s</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
                <span>Resend Email</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handleRefresh} 
            disabled={refreshing} 
            className="btn secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
          >
            {refreshing ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23,4 23,10 17,10"/>
                  <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                </svg>
                <span>Check Status</span>
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div style={{ 
          marginTop: 'var(--space-5)', 
          paddingTop: 'var(--space-4)', 
          borderTop: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
}