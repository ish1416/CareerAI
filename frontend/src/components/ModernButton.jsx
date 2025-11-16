import React from 'react';

export default function ModernButton({ 
  children, 
  variant = 'default', 
  size = 'md', 
  icon, 
  disabled = false,
  className = '',
  ...props 
}) {
  const variants = {
    default: 'btn',
    primary: 'btn btn-primary',
    outline: 'btn',
    ghost: 'btn'
  };

  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const ghostStyle = variant === 'ghost' ? {
    border: 'none',
    background: 'transparent'
  } : {};

  const outlineStyle = variant === 'outline' ? {
    background: 'transparent',
    color: 'var(--text)'
  } : {};

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      style={{
        ...ghostStyle,
        ...outlineStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}