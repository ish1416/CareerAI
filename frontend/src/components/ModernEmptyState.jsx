import React from 'react';
import { Link } from 'react-router-dom';

export default function ModernEmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionLink,
  secondaryActionText,
  secondaryActionLink 
}) {
  return (
    <div className="card" style={{
      textAlign: 'center',
      padding: 'var(--space-8)',
      background: 'var(--surface)',
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius-lg)'
    }}>
      {Icon && (
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--muted)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)',
          opacity: 0.6
        }}>
          <Icon size={40} color="var(--text-muted)" />
        </div>
      )}
      
      <h3 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 600,
        marginBottom: 'var(--space-2)',
        color: 'var(--text)'
      }}>
        {title}
      </h3>
      
      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--text-soft)',
        marginBottom: 'var(--space-5)',
        maxWidth: '400px',
        margin: '0 auto var(--space-5)',
        lineHeight: 1.6
      }}>
        {description}
      </p>
      
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
        {actionText && actionLink && (
          <Link to={actionLink} className="btn primary">
            {actionText}
          </Link>
        )}
        {secondaryActionText && secondaryActionLink && (
          <Link to={secondaryActionLink} className="btn secondary">
            {secondaryActionText}
          </Link>
        )}
      </div>
    </div>
  );
}