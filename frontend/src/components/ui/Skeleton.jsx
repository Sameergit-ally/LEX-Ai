import React from 'react';

export default function Skeleton({ className = '', width, height, rounded = 'rounded-lg' }) {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
      }}
    />
  );
}
