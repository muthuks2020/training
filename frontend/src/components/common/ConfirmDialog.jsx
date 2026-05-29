import React from 'react';
export const ConfirmDialog = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="dialog-backdrop" onClick={onCancel}>
    <div className="dialog" onClick={e => e.stopPropagation()}>
      <div className="dialog-icon">⚠️</div>
      <div className="dialog-title">{title}</div>
      <div className="dialog-text">{message}</div>
      <div className="dialog-actions">
        <button className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? <span className="spinner" style={{width:16,height:16}} /> : null}
          {loading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);
