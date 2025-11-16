import React from 'react';

export default function ModernFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  href,
  badge,
  compact = false 
}) {
  const CardComponent = href ? 'a' : 'div';
  
  return (
    <CardComponent
      href={href}
      className={`card ${compact ? 'card-compact' : ''}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        cursor: href ? 'pointer' : 'default'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{
            width: 40,
            height: 40,
            background: 'var(--gray-100)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold m-0">{title}</h3>
            {badge && (
              <span
                className="text-xs"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 500
                }}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-secondary m-0" style={{ lineHeight: 1.5 }}>
        {description}
      </p>
    </CardComponent>
  );
}