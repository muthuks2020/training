import React from 'react';

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

export const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast ${t.type}`}>
        <span className="toast-icon">{ICONS[t.type]}</span>
        <span className="toast-message">{t.message}</span>
      </div>
    ))}
  </div>
);
