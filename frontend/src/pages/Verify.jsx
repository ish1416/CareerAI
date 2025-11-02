import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import Logo from '../components/Logo.jsx';

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, reloadUser } = useAuth();
  const [status, setStatus] = useState('idle'); // idle | verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }
    const run = async () => {
      setStatus('verifying');
      setMessage('Verifying your email…');
      try {
        await api.get('/auth/verify-email', { params: { token } });
        setStatus('success');
        setMessage('Email verified successfully.');
        if (user && typeof reloadUser === 'function') {
          await reloadUser();
          setTimeout(() => navigate('/dashboard', { replace: true }), 600);
        }
      } catch (e) {
        const msg = e?.response?.data?.error || 'Invalid or expired verification link.';
        setStatus('error');
        setMessage(msg);
      }
    };
    run();
  }, [location.search, user, reloadUser, navigate]);

  const getStatusIcon = () => {
    if (status === 'verifying') {
      return (
        <svg className="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
      );
    }
    if (status === 'success') {
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      );
    }
    if (status === 'error') {
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="auth-wrap" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-subtle) 100%)' }}>
      <div className="card auth-card form" style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div className="auth-header" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: status === 'success' ? 'var(--success-bg)' : status === 'error' ? 'var(--error-bg)' : 'rgba(99,102,241,0.12)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--space-4)'
          }}>
            {getStatusIcon()}
          </div>
          <Logo size={48} />
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', margin: 'var(--space-3) 0 var(--space-2) 0' }}>
            Email Verification
          </h2>
          <p className="muted" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
            {status === 'verifying' && 'Please wait while we verify your email address.'}
            {status === 'success' && 'Your email has been successfully verified!'}
            {status === 'error' && 'We encountered an issue verifying your email.'}
            {status === 'idle' && 'Processing your verification request...'}
          </p>
        </div>

        {message && (
          <div className={`badge ${status === 'error' ? 'error' : 'success'}`} style={{ 
            width: '100%', 
            padding: 'var(--space-3)', 
            marginBottom: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)'
          }}>
            <span>{message}</span>
          </div>
        )}

        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {status === 'success' && (
            <Link to="/dashboard" className="btn primary" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 'var(--space-2)',
              textDecoration: 'none'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span>Go to Dashboard</span>
            </Link>
          )}
          
          {status === 'error' && (
            <>
              <Link to="/verify-email" className="btn primary" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 'var(--space-2)',
                textDecoration: 'none'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>Resend Verification</span>
              </Link>
              
              <Link to="/login" className="btn secondary" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 'var(--space-2)',
                textDecoration: 'none'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 01 2 2v14a2 2 0 01-2 2h-4"/>
                  <polyline points="10,17 15,12 10,7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                <span>Back to Login</span>
              </Link>
            </>
          )}
          
          {status === 'verifying' && (
            <div style={{ 
              padding: 'var(--space-4)', 
              color: 'var(--text-soft)',
              fontSize: 'var(--text-sm)'
            }}>
              This may take a few moments...
            </div>
          )}
        </div>

        {status !== 'verifying' && (
          <div style={{ 
            marginTop: 'var(--space-5)', 
            paddingTop: 'var(--space-4)', 
            borderTop: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              {status === 'success' 
                ? 'Welcome to CareerAI! Your account is now active.' 
                : 'Need help? Contact our support team.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}