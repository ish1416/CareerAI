import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { useToast } from '../components/Toast.jsx';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Google OAuth error:', error);
        showToast('Google authentication failed', 'error');
        navigate('/job-tracker');
        return;
      }

      if (code) {
        try {
          await api.post('/job-tracker/google/callback', { code });
          showToast('Google Calendar connected successfully!', 'success');
          
          const returnPath = localStorage.getItem('google_auth_return') || '/job-tracker';
          localStorage.removeItem('google_auth_return');
          navigate(returnPath);
        } catch (error) {
          console.error('Failed to process Google callback:', error);
          showToast('Failed to connect Google Calendar', 'error');
          navigate('/job-tracker');
        }
      } else {
        navigate('/job-tracker');
      }
    };

    handleCallback();
  }, [searchParams, navigate, showToast]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }}>
      <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      <p>Connecting to Google Calendar...</p>
    </div>
  );
}