import React from 'react';

export default function Button({
  children,
  variant = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = variant !== 'default' ? variant : '';
  const sizeClass = size !== 'medium' ? size : '';
  const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
}

// Add spinner animation to index.css or inline
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('style[data-spinner]')) {
  style.setAttribute('data-spinner', 'true');
  document.head.appendChild(style);
}