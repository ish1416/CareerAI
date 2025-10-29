import React from 'react';

export default function Logo({ size = 28, pulse = false, gradient = false }) {
  const sources = ['/brand.png'];
  const handleError = (e) => {
    e.target.onerror = null;
    const current = e.target.getAttribute('data-src-index') || '0';
    const nextIndex = parseInt(current, 10) + 1;
    if (nextIndex < sources.length) {
      e.target.setAttribute('data-src-index', String(nextIndex));
      e.target.src = sources[nextIndex];
    } else {
      e.target.src = sources[sources.length - 1];
    }
  };
  return (
    <span
      className={`logo-wrap${pulse ? ' pulse' : ''}${gradient ? ' gradient' : ''}`}
      style={{ display: 'inline-grid', placeItems: 'center', width: size, height: size }}
    >
      <img
        src={sources[0]}
        alt="Career AI logo"
        width={size}
        height={size}
        onError={handleError}
        data-src-index="0"
        style={{ display: 'inline-block', borderRadius: 12 }}
      />
    </span>
  );
}