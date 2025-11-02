import React from 'react';
import { Brain } from 'lucide-react';

export default function Logo({ size = 28, pulse = false, gradient = false }) {
  return (
    <div
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: size, 
        height: size,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        animation: pulse ? 'pulse 2s infinite' : 'none'
      }}
    >
      <Brain size={size * 0.6} color="white" />
    </div>
  );
}