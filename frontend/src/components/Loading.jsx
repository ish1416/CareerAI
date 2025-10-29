import React from 'react';

export default function Loading({ message = 'Loading...', size = 'medium' }) {
  const sizeClasses = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-5)',
      minHeight: '200px'
    }}>
      <div 
        className="spinner"
        style={{
          ...sizeClasses[size],
          border: '3px solid var(--muted)',
          borderTop: '3px solid var(--accent-blue)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p className="muted" style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
        {message}
      </p>
    </div>
  );
}

export function PageLoading({ message = 'Loading page...' }) {
  return (
    <div className="page" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <Loading message={message} size="large" />
    </div>
  );
}