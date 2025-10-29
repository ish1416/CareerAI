import React from 'react';

export default function PageLayout({ 
  title, 
  subtitle, 
  actions, 
  children, 
  spacing = 'var(--space-4)' 
}) {
  return (
    <div className="page-layout" style={{ width: '100%', padding: `0 ${spacing}` }}>
      <div className="page-header" style={{ 
        marginBottom: 'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: 'var(--space-4)' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: 'var(--text-4xl)', 
              fontWeight: 800, 
              marginBottom: 'var(--space-2)',
              color: 'var(--text)'
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--text-soft)',
                margin: 0,
                maxWidth: '600px',
                lineHeight: 1.6
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexShrink: 0 }}>
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export function Section({ title, subtitle, children, spacing = 'var(--space-6)' }) {
  return (
    <section style={{ marginBottom: spacing }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          {title && (
            <h2 style={{ 
              fontSize: 'var(--text-2xl)', 
              fontWeight: 700, 
              marginBottom: subtitle ? 'var(--space-2)' : 0,
              color: 'var(--text)'
            }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ 
              fontSize: 'var(--text-base)', 
              color: 'var(--text-soft)',
              margin: 0,
              lineHeight: 1.6
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}