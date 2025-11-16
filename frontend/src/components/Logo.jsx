import React from 'react';
import { Brain } from 'lucide-react';
import '../styles/modern-theme.css';

export default function Logo({ size = 28, pulse = false, gradient = false, variant = 'default' }) {
  const variants = {
    default: {
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      shadow: 'var(--shadow-glow)'
    },
    accent: {
      background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
      shadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
    },
    minimal: {
      background: 'var(--surface-elevated)',
      shadow: 'var(--shadow-sm)',
      border: '1px solid var(--border)'
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <div
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: size, 
        height: size,
        background: style.background,
        border: style.border || 'none',
        color: variant === 'minimal' ? 'var(--primary)' : 'var(--text-inverse)',
        fontWeight: 'var(--font-bold)',
        fontSize: size * 0.4,
        borderRadius: 'var(--radius-md)',
        boxShadow: style.shadow,
        animation: pulse ? 'pulse 2s infinite' : 'none',
        transition: 'var(--transition)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="hover-lift"
    >
      <Brain 
        size={size * 0.6} 
        color={variant === 'minimal' ? 'var(--primary)' : 'white'} 
        strokeWidth={2.5}
      />
    </div>
  );
}