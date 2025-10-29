import React, { useState, useEffect } from 'react';
import { Loader2, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

// Smart loading component with progress and context
export function SmartLoading({ 
  message = 'Loading...', 
  progress = null, 
  size = 'medium',
  showProgress = false,
  timeout = 30000,
  onTimeout,
  context = 'general'
}) {
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      onTimeout?.();
    }, timeout);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [timeout, onTimeout]);
  
  const sizeMap = {
    small: { spinner: 16, container: '120px' },
    medium: { spinner: 24, container: '200px' },
    large: { spinner: 32, container: '300px' }
  };
  
  const contextMessages = {
    auth: 'Authenticating...',
    api: 'Connecting to server...',
    upload: 'Processing file...',
    analysis: 'Analyzing resume...',
    general: message
  };
  
  if (timeoutReached) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: sizeMap[size].container,
        textAlign: 'center',
        padding: 'var(--space-4)'
      }}>
        <AlertCircle size={sizeMap[size].spinner} color="var(--warning)" />
        <p style={{ margin: 'var(--space-2) 0', color: 'var(--text-soft)' }}>
          This is taking longer than expected
        </p>
        {!isOnline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--error)' }}>
            <WifiOff size={16} />
            <span>You appear to be offline</span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: sizeMap[size].container,
      textAlign: 'center',
      padding: 'var(--space-4)'
    }}>
      <div style={{ position: 'relative', marginBottom: 'var(--space-3)' }}>
        <Loader2 
          size={sizeMap[size].spinner} 
          color="var(--primary)" 
          style={{ animation: 'spin 1s linear infinite' }}
        />
        {!isOnline && (
          <WifiOff 
            size={12} 
            color="var(--error)" 
            style={{ position: 'absolute', top: -4, right: -4 }}
          />
        )}
      </div>
      
      <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>
        {contextMessages[context] || message}
      </p>
      
      {showProgress && progress !== null && (
        <div style={{ width: '100%', maxWidth: '200px', marginTop: 'var(--space-2)' }}>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'var(--muted)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.max(0, Math.min(100, progress))}%`,
              height: '100%',
              background: 'var(--primary)',
              transition: 'width 0.3s ease',
              borderRadius: '2px'
            }} />
          </div>
          <p style={{ 
            margin: 'var(--space-1) 0 0', 
            fontSize: 'var(--text-xs)', 
            color: 'var(--text-muted)' 
          }}>
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}

// Skeleton loading for content
export function SkeletonLoader({ lines = 3, width = '100%' }) {
  return (
    <div style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '1rem',
            background: 'linear-gradient(90deg, var(--muted) 0%, var(--panel-hover) 50%, var(--muted) 100%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton 1.5s ease-in-out infinite',
            borderRadius: 'var(--radius)',
            marginBottom: i < lines - 1 ? 'var(--space-2)' : 0,
            width: i === lines - 1 ? '70%' : '100%'
          }}
        />
      ))}
    </div>
  );
}

// Success state component
export function SuccessState({ message, action, onAction }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      textAlign: 'center',
      padding: 'var(--space-4)'
    }}>
      <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 'var(--space-3)' }} />
      <p style={{ margin: '0 0 var(--space-3)', color: 'var(--text)' }}>{message}</p>
      {action && onAction && (
        <button className="btn primary" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

// Connection status indicator
export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!showStatus) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: isOnline ? 'var(--success-bg)' : 'var(--error-bg)',
      color: isOnline ? 'var(--success)' : 'var(--error)',
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--radius)',
      border: `1px solid ${isOnline ? 'var(--success-border)' : 'var(--error-border)'}`,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      zIndex: 1000,
      fontSize: 'var(--text-sm)',
      animation: 'slideInRight 0.3s ease'
    }}>
      {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>{isOnline ? 'Back online' : 'You are offline'}</span>
    </div>
  );
}