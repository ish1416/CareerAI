import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ConnectionTest() {
  const [status, setStatus] = useState('testing');
  const [details, setDetails] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('testing');
      setDetails('Connecting to backend...');
      
      const response = await api.get('/health');
      
      if (response.data?.status === 'ok') {
        setStatus('success');
        setDetails(`Connected! Server timestamp: ${new Date(response.data.timestamp).toLocaleTimeString()}`);
      } else {
        setStatus('error');
        setDetails('Backend responded but with unexpected data');
      }
    } catch (error) {
      setStatus('error');
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        setDetails('Network error - Backend server may be down or CORS issue');
      } else {
        setDetails(`HTTP ${error.response?.status}: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  if (process.env.NODE_ENV !== 'development') return null;

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '120px',
      right: '10px',
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 'var(--space-3)',
      fontSize: 'var(--text-xs)',
      zIndex: 9997,
      maxWidth: '280px',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-2)'
      }}>
        <strong style={{ color: getStatusColor() }}>Backend Connection</strong>
        <button 
          onClick={testConnection}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            color: 'var(--text-soft)'
          }}
        >
          Test
        </button>
      </div>
      <div style={{ color: 'var(--text)' }}>Status: {status}</div>
      <div style={{ 
        color: 'var(--text-muted)', 
        marginTop: 'var(--space-1)',
        fontSize: '11px'
      }}>
        {details}
      </div>
    </div>
  );
}