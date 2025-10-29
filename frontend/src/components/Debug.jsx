import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Debug() {
  const { user, loading, initialized } = useAuth();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 'var(--space-2)',
      fontSize: 'var(--text-xs)',
      zIndex: 9999,
      maxWidth: '200px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>User: {user ? '✓' : '✗'}</div>
      <div>Loading: {loading ? '✓' : '✗'}</div>
      <div>Initialized: {initialized ? '✓' : '✗'}</div>
      <div>Token: {localStorage.getItem('token') ? '✓' : '✗'}</div>
    </div>
  );
}