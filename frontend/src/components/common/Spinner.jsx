import React from 'react';
export const Spinner = ({ size = 18 }) => (
  <span className="spinner" style={{ width: size, height: size }} />
);
export const LoadingOverlay = () => (
  <div className="loading-overlay">
    <Spinner size={32} />
  </div>
);
