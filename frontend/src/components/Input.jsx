import React from 'react';

export default function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`input-wrapper ${className}`} style={{ display: 'grid', gap: 'var(--space-2)' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={error ? 'error' : ''}
        style={{
          boxShadow: 'var(--shadow-sm)',
          borderColor: error ? 'var(--error)' : 'var(--border)',
          ...props.style
        }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}