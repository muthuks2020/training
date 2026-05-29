/**
 * components/StatusBadge.jsx
 */
import React from 'react';

export function StatusBadge({ status }) {
  if (!status) return <span style={{ color: 'var(--gray-400)' }}>—</span>;
  return (
    <span className={`status-badge status-${status}`}>
      {status}
    </span>
  );
}

export function TypeBadge({ type }) {
  if (!type) return <span style={{ color: 'var(--gray-400)' }}>—</span>;
  return (
    <span className={`type-badge type-${type}`}>
      {type}
    </span>
  );
}
