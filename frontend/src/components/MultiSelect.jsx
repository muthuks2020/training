/**
 * components/MultiSelect.jsx
 * --------------------------
 * Dropdown multi-select component for location field.
 */

import React, { useState, useRef, useEffect } from 'react';

const CHEVRON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function MultiSelect({
  options = [],
  value   = [],      // array of selected values
  onChange,
  placeholder = 'Select options…',
  error = false,
}) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggle(optValue) {
    const next = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];
    onChange(next);
  }

  function removeTag(optValue, e) {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  }

  return (
    <div className="multi-select-container" ref={ref}>
      <div
        className={`multi-select-trigger ${open ? 'open' : ''} ${error ? 'error' : ''}`}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o); }}
      >
        <div className="multi-select-tags">
          {value.length === 0 ? (
            <span className="multi-select-placeholder">{placeholder}</span>
          ) : (
            value.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className="tag">
                  {opt?.label || v}
                  <button className="tag-remove" onClick={(e) => removeTag(v, e)} type="button">
                    ×
                  </button>
                </span>
              );
            })
          )}
        </div>
        <span style={{ color: 'var(--gray-400)', transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : '' }}>
          {CHEVRON}
        </span>
      </div>

      {open && (
        <div className="multi-select-dropdown">
          {options.map((opt) => {
            const selected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`multi-select-option ${selected ? 'selected' : ''}`}
                onClick={() => toggle(opt.value)}
              >
                <input type="checkbox" readOnly checked={selected} tabIndex={-1} />
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
