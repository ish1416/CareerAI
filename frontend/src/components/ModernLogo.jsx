import React from 'react';

export default function ModernLogo({ size = 32, variant = 'default' }) {
  const logoStyles = {
    default: {
      background: 'var(--text)',
      color: 'var(--background)'
    },
    primary: {
      background: 'var(--primary)',
      color: 'white'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text)',
      border: '2px solid var(--text)'
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: size * 0.4,
        letterSpacing: '-0.02em',
        transition: 'var(--transition)',
        ...logoStyles[variant]
      }}
    >
      CA
    </div>
  );
}