import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, accent = 'var(--accent-blue)', trend }) {
  return (
    <div className="card shine stat-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-2)',
      transition: 'all var(--transition-base)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-soft)' }}>
          {title}
        </h4>
        {Icon && (
          <span className="icon-bubble" aria-hidden="true" style={{ 
            width: '40px', 
            height: '40px',
            background: `${accent}15`,
            color: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius)'
          }}>
            <Icon size={20} />
          </span>
        )}
      </div>
      <div style={{ 
        fontSize: 'var(--text-4xl)', 
        fontWeight: 800, 
        letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }}>
        {value}
      </div>
      {subtext && (
        <div className="muted" style={{ fontSize: 'var(--text-sm)' }}>
          {subtext}
        </div>
      )}
      {trend && (
        <div style={{ 
          fontSize: 'var(--text-xs)', 
          color: trend > 0 ? 'var(--success)' : 'var(--error)',
          fontWeight: 600
        }}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}