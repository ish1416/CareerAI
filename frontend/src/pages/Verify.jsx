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

  return (
    <>
      <div className="auth-wrap">
        <div className="card auth-card form">
          <div className="auth-header">
            <Logo size={56} />
            <h2>Email Verification</h2>
            <p className="sub">
              {status === 'verifying' && 'Please wait while we verify your email address.'}
              {status === 'success' && 'Your email has been successfully verified.'}
              {status === 'error' && 'We encountered an issue verifying your email.'}
              {status === 'idle' && 'Processing your verification request...'}
            </p>
          </div>

          {message && (
            <div className={status === 'error' ? 'form-error' : 'form-success'} role="alert">
              {status === 'error' ? (
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
              <div>{message}</div>
            </div>
          )}

          <div className="form-actions">
            {status === 'success' && !user && (
              <Link to="/login" className="btn cta gradient">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Continue to login
              </Link>
            )}
            {status === 'error' && (
              <Link to="/verify-email" className="btn small ghost">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2v4" />
                  <path d="M2 10v4" />
                  <path d="M2 18v4" />
                  <path d="M10 2v4" />
                  <path d="M10 10v4" />
                  <path d="M10 18v4" />
                  <path d="M18 2v4" />
                  <path d="M18 10v4" />
                  <path d="M18 18v4" />
                </svg>
                Resend verification email
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}