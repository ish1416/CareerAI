import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FileQuestion, 
  title = 'No data found', 
  description = 'Get started by creating your first item.',
  action,
  actionLabel = 'Get Started'
}) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        minHeight: '400px'
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}
      >
        <Icon size={40} />
      </div>
      <div style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: 0, marginBottom: 'var(--space-2)', fontSize: 'var(--text-2xl)' }}>
          {title}
        </h3>
        <p className="muted" style={{ margin: 0, fontSize: 'var(--text-base)' }}>
          {description}
        </p>
      </div>
      {action && (
        <button className="btn primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}