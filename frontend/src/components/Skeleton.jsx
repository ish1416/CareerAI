import React from 'react';

export default function Skeleton({ variant = 'text', width, height, className = '', style = {} }) {
  const baseClass = 'skeleton';
  const variantClass = variant;
  const classes = [baseClass, variantClass, className].filter(Boolean).join(' ');

  const inlineStyle = {
    ...style,
    ...(width && { width }),
    ...(height && { height }),
  };

  return <div className={classes} style={inlineStyle} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="card">
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </div>
  );
}

export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}