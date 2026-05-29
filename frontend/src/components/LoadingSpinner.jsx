/**
 * components/LoadingSpinner.jsx
 */
import React from 'react';

export default function LoadingSpinner({ size = 20, color = '#2563a8', label = '' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: '#64748b',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width:          size,
          height:         size,
          border:         `2px solid ${color}22`,
          borderTopColor: color,
          borderRadius:   '50%',
          display:        'inline-block',
          animation:      'spin 0.7s linear infinite',
          flexShrink:     0,
        }}
      />
      {label && <span>{label}</span>}
    </span>
  );
}
