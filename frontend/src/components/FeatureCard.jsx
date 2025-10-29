import React from 'react';

export default function FeatureCard({ icon: Icon, title, description, accent = 'var(--accent-blue)' }) {
  return (
    <div className="card shine interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: 'var(--space-5)'
    }}>
      <div className="icon-bubble" style={{
        width: '56px',
        height: '56px',
        background: `${accent}15`,
        color: accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-spring)'
      }}>
        {Icon && <Icon size={28} />}
      </div>
      <h4 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 }}>
        {title}
      </h4>
      <p className="muted" style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}