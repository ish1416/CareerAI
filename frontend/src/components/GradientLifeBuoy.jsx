import React from 'react';

export default function GradientLifeBuoy({ size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="buoyGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a8c5ff" />
          <stop offset="100%" stopColor="#f7b3d6" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#buoyGradient)" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="url(#buoyGradient)" strokeWidth="2" />
      <path d="M15 15l2 2" stroke="url(#buoyGradient)" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 9l2 -2" stroke="url(#buoyGradient)" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 15l-2 2" stroke="url(#buoyGradient)" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 9l-2 -2" stroke="url(#buoyGradient)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}