/**
 * components/Alert.jsx
 * --------------------
 * Reusable alert / notification banner.
 */

import React from 'react';

const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

export default function Alert({ type = 'info', message, onClose, className = '' }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} ${className}`} role="alert">
      <span className="alert-icon">{ICONS[type]}</span>
      <span style={{ flex: 1, lineHeight: 1.5 }}>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
