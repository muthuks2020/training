import React from 'react';
const DOT = { active: '●', inactive: '●', pending: '●' };
export const StatusBadge = ({ value }) => (
  <span className={`badge badge-${value}`}>{DOT[value] || ''} {value}</span>
);
export const TypeBadge = ({ value }) => (
  <span className={`badge badge-${value}`}>{value}</span>
);
