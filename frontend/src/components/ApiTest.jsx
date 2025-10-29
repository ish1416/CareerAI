import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

export default function ApiTest() {
  const [status, setStatus] = useState('testing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await api.get('/health');
        if (response.data.status === 'ok') {
          setStatus('connected');
        } else {
          setStatus('error');
          setError('Unexpected response');
        }
      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    };

    testApi();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 'var(--space-2)',
      fontSize: 'var(--text-xs)',
      zIndex: 9999,
      maxWidth: '200px'
    }}>
      <div><strong>API Status:</strong></div>
      <div style={{ 
        color: status === 'connected' ? 'var(--success)' : 
               status === 'error' ? 'var(--error)' : 'var(--warning)'
      }}>
        {status === 'connected' ? '✓ Connected' : 
         status === 'error' ? '✗ Error' : '⏳ Testing...'}
      </div>
      {error && <div style={{ color: 'var(--error)', fontSize: '10px' }}>{error}</div>}
    </div>
  );
}