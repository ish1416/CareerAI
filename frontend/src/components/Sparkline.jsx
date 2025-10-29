import React from 'react';

export default function Sparkline({ data = [], width = 300, height = 64, stroke = 'var(--accent-blue)' }) {
  if (!Array.isArray(data) || data.length < 2) {
    return <div className="muted">Not enough data</div>;
  }
  const w = Math.max(width, data.length * 24);
  const h = height;
  const pad = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const points = data.map((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / (data.length - 1);
    const y = h - pad - ((v - min) * (h - 2 * pad)) / range;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" />
      {data.map((v, i) => {
        const x = pad + (i * (w - 2 * pad)) / (data.length - 1);
        const y = h - pad - ((v - min) * (h - 2 * pad)) / range;
        return <circle key={i} cx={x} cy={y} r="2.5" fill={stroke} />
      })}
    </svg>
  );
}