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
    setError('');
    setMessage('');
    setRefreshing(true);
    try {
      if (typeof reloadUser === 'function') {
        await reloadUser();
      } else {
        const { data } = await api.get('/user/profile');
        if (data?.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (u?.emailVerified) {
        setMessage('Email verified. Redirecting to dashboard…');
        setTimeout(() => navigate('/dashboard', { replace: true }), 700);
      } else {
        setMessage('Still unverified. Please check your email link.');
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Unable to refresh verification status');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <div className="auth-wrap">
        <div className="card auth-card form">
          <div className="auth-header">
            <Logo size={56} />
            <h2>Verify your email</h2>
            <p className="sub">
              We sent a secure verification link{user?.email ? ` to ` : ''}
              <span className="font-medium">{user?.email}</span>
            </p>
          </div>

          {message && (
            <div className="form-success" role="alert">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>{message}</div>
            </div>
          )}
          
          {error && (
            <div className="form-error" role="alert">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>{error}</div>
            </div>
          )}

          <div className="form-actions">
            <button 
              onClick={handleResend} 
              disabled={sending || cooldown > 0} 
              className={cooldown > 0 ? "btn small ghost" : "btn small primary"}
            >
              {sending ? (
                <span className="flex items-center">
                  <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : cooldown > 0 ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Wait {cooldown}s
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 012-2h3.9L9 6.7A3 3 0 0111.27 5h1.46A3 3 0 0115 6.7l1.1 1.3H20a2 2 0 011.2.4" />
                    <path d="M12 13v4" />
                    <path d="M10 15h4" />
                  </svg>
                  Resend Email
                </span>
              )}
            </button>
            
            <button 
              onClick={handleRefresh} 
              disabled={refreshing} 
              className="btn small ghost"
            >
              {refreshing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v4" />
                    <path d="M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6" />
                    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  Check verification status
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}