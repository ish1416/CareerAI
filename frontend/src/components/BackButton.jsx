import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ to = '/ai-advanced', label = 'Back to AI Advanced' }) {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(to)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: 'none',
        color: 'var(--text-soft)',
        fontSize: '14px',
        cursor: 'pointer',
        marginBottom: '24px',
        padding: '8px 0',
        transition: 'color 0.2s ease'
      }}
      onMouseOver={(e) => e.target.style.color = 'var(--text)'}
      onMouseOut={(e) => e.target.style.color = 'var(--text-soft)'}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}