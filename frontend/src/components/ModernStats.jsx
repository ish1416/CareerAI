import React from 'react';

export default function ModernStats() {
  const stats = [
    { label: 'Active Users', value: '50,000+' },
    { label: 'Resumes Created', value: '200,000+' },
    { label: 'Job Matches', value: '1M+' },
    { label: 'Success Rate', value: '98%' }
  ];

  return (
    <section className="section" style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
      <div className="container">
        <div className="grid grid-4" style={{ gap: 'var(--space-8)' }}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--text)' }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-secondary font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}