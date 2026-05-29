import React, { useState, useRef, useEffect } from 'react';
import { LOCATIONS, CUSTOMER_TYPES, GENDER_OPTIONS, STATUS_OPTIONS } from '../../utils/validators';

/* ── Multi-Select ─────────────────────────────────────────── */
const MultiSelect = ({ value = [], onChange, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const toggle = (loc) => {
    if (value.includes(loc)) onChange(value.filter(v => v !== loc));
    else onChange([...value, loc]);
  };
  return (
    <div className="multi-select-wrapper" ref={ref}>
      <div className={`multi-select-display ${open ? 'open' : ''} ${error ? 'error' : ''}`} onClick={() => setOpen(!open)}>
        {value.length === 0
          ? <span className="multi-select-placeholder">Select locations…</span>
          : value.map(v => (
            <span key={v} className="chip">
              {v}
              <span className="chip-remove" onClick={e => { e.stopPropagation(); toggle(v); }}>×</span>
            </span>
          ))}
      </div>
      {open && (
        <div className="multi-select-dropdown">
          {LOCATIONS.map(loc => (
            <div key={loc} className={`multi-option ${value.includes(loc) ? 'selected' : ''}`} onClick={() => toggle(loc)}>
              <span className="multi-checkbox" />
              {loc}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Radio Group ──────────────────────────────────────────── */
const RadioGroup = ({ options, value, onChange }) => (
  <div className="radio-group">
    {options.map(opt => (
      <label key={opt.value} className={`radio-option ${value === opt.value ? 'selected' : ''}`}>
        <input type="radio" value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} />
        <span className="radio-dot" />
        {opt.label}
      </label>
    ))}
  </div>
);

/* ── Status Toggle ────────────────────────────────────────── */
const StatusToggle = ({ value, onChange }) => (
  <div className="status-toggle">
    {STATUS_OPTIONS.map(opt => (
      <button
        key={opt.value}
        type="button"
        className={`status-option ${value === opt.value ? `${opt.value}-opt` : ''}`}
        onClick={() => onChange(opt.value)}
      >{opt.label}</button>
    ))}
  </div>
);

/* ── Main CustomerForm ────────────────────────────────────── */
export const CustomerForm = ({ form, errors, onChange, mode = 'create' }) => {
  const set = (field) => (e) => {
    const val = e.target ? e.target.value : e;
    onChange(field, val);
  };

  return (
    <div className="fade-in">
      {/* ── Personal Info ── */}
      <div className="section-divider">
        <span className="section-divider-label">Personal Information</span>
        <span className="section-divider-line" />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Customer Name <span className="required">*</span></label>
          <input
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={form.customer_name || ''}
            onChange={set('customer_name')}
            className={errors.customer_name ? 'error' : ''}
          />
          {errors.customer_name && <span className="field-error">⚠ {errors.customer_name}</span>}
        </div>

        <div className="form-group">
          <label>Mobile Number <span className="required">*</span></label>
          <input
            type="text"
            placeholder="10-digit number, e.g. 9876543210"
            value={form.mobile_number || ''}
            onChange={set('mobile_number')}
            maxLength={10}
            className={errors.mobile_number ? 'error' : ''}
          />
          {errors.mobile_number && <span className="field-error">⚠ {errors.mobile_number}</span>}
        </div>

        <div className="form-group">
          <label>Email Address <span className="required">*</span></label>
          <input
            type="email"
            placeholder="e.g. rajesh@email.com"
            value={form.email || ''}
            onChange={set('email')}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="field-error">⚠ {errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <RadioGroup options={GENDER_OPTIONS} value={form.gender || ''} onChange={set('gender')} />
        </div>
      </div>

      {/* ── Business Details ── */}
      <div className="section-divider">
        <span className="section-divider-label">Business Details</span>
        <span className="section-divider-line" />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Customer Type</label>
          <select value={form.customer_type || 'individual'} onChange={set('customer_type')}>
            {CUSTOMER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <StatusToggle value={form.status || 'active'} onChange={set('status')} />
        </div>

        <div className="form-group">
          <label>Location (Multi-select)</label>
          <MultiSelect
            value={Array.isArray(form.location) ? form.location : (form.location ? [form.location] : [])}
            onChange={(v) => onChange('location', v.join(', '))}
            error={errors.location}
          />
          {errors.location && <span className="field-error">⚠ {errors.location}</span>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Full mailing address"
            value={form.address || ''}
            onChange={set('address')}
          />
        </div>
      </div>
    </div>
  );
};
