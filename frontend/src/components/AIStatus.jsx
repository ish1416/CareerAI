import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import api from '../utils/api';

export default function AIStatus() {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    setStatus('checking');
    setMessage('Checking AI services...');
    
    try {
      // Test AI functionality with dedicated test endpoint
      const { data } = await api.get('/resume/test/ai');
      
      if (data.success) {
        const result = (data.result || '').trim();
        const hasKeys = data.hasApiKeys;
        
        if (!result) {
          setStatus('error');
          setMessage('AI returned empty response');
          setDetails(`Keys: HF=${hasKeys.hf}, OpenRouter=${hasKeys.openrouter}`);
        } else if (/^AI is offline/i.test(result)) {
          setStatus('warning');
          setMessage('AI service offline');
          setDetails(`Keys: HF=${hasKeys.hf}, OpenRouter=${hasKeys.openrouter}`);
        } else if (result.length < 10) {
          setStatus('warning');
          setMessage('AI response too short');
          setDetails(`Got: "${result.substring(0, 50)}..." (${result.length} chars)`);
        } else {
          setStatus('success');
          setMessage('AI services working');
          setDetails(`Response: ${result.length} chars, Keys: HF=${hasKeys.hf}, OR=${hasKeys.openrouter}`);
        }
      } else {
        setStatus('error');
        setMessage('AI test failed');
        setDetails(data.error || 'Unknown error from test endpoint');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Connection failed');
      setDetails(error?.response?.data?.error || error.message || 'Backend unreachable');
    }
  };

  if (process.env.NODE_ENV !== 'development') return null;

  const getIcon = () => {
    switch (status) {
      case 'checking': return <Loader size={16} className="animate-spin" />;
      case 'success': return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'warning': return <AlertCircle size={16} style={{ color: 'var(--warning)' }} />;
      case 'error': return <AlertCircle size={16} style={{ color: 'var(--error)' }} />;
      default: return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'error': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '60px',
      right: '10px',
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 'var(--space-3)',
      fontSize: 'var(--text-xs)',
      zIndex: 9998,
      maxWidth: '280px',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-2)'
      }}>
        {getIcon()}
        <strong style={{ color: getStatusColor() }}>AI Status</strong>
        <button 
          onClick={checkAIStatus}
          disabled={status === 'checking'}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            fontSize: 'var(--text-xs)',
            cursor: status === 'checking' ? 'not-allowed' : 'pointer',
            color: 'var(--text-soft)',
            opacity: status === 'checking' ? 0.5 : 1
          }}
        >
          {status === 'checking' ? '...' : 'Test'}
        </button>
      </div>
      <div style={{ color: 'var(--text)' }}>{message}</div>
      {details && (
        <div style={{ 
          color: 'var(--text-muted)', 
          marginTop: 'var(--space-1)',
          fontSize: '11px'
        }}>
          {details}
        </div>
      )}
    </div>
  );
}