import React from 'react';
export const Pagination = ({ page, total, perPage, onChange }) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);
  return (
    <div className="pagination">
      <span className="page-info">Showing {from}–{to} of {total}</span>
      <button className="page-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        let p = i + 1;
        if (totalPages > 7) {
          if (page <= 4) p = i + 1;
          else if (page >= totalPages - 3) p = totalPages - 6 + i;
          else p = page - 3 + i;
        }
        return (
          <button key={p} className={`page-btn ${p === page ? 'current' : ''}`} onClick={() => onChange(p)}>{p}</button>
        );
      })}
      <button className="page-btn" onClick={() => onChange(page + 1)} disabled={page === totalPages}>›</button>
    </div>
  );
};
