/**
 * components/ConfirmDialog.jsx
 * ----------------------------
 * Modal confirmation dialog for destructive actions.
 */

import React from 'react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-icon">🗑️</div>
        <h2>{title || 'Are you sure?'}</h2>
        <p>{message || 'This action cannot be undone.'}</p>
        <div className="confirm-dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger btn-loading" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Deleting…
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
