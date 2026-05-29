/**
 * components/CustomerForm.jsx
 * ----------------------------
 * Shared form component for both creating and updating customers.
 * Props:
 *   - initialData    : initial field values (for update)
 *   - onSubmit       : function called with form data on submit
 *   - mode           : 'create' | 'update'
 *   - loading        : boolean
 *   - serverError    : string | null
 *   - serverSuccess  : string | null
 */

import React, { useState, useEffect } from 'react';
import MultiSelect   from './MultiSelect';
import Alert         from './Alert';
import LoadingSpinner from './LoadingSpinner';
import { validateCreateForm, validateUpdateForm, isValid } from '../utils/validators';

// ── Options ───────────────────────────────────────────────────────────────────

const LOCATION_OPTIONS = [
  { value: 'Chennai',       label: 'Chennai'       },
  { value: 'Mumbai',        label: 'Mumbai'         },
  { value: 'Pune',          label: 'Pune'           },
  { value: 'Coimbatore',    label: 'Coimbatore'     },
  { value: 'Madurai',       label: 'Madurai'        },
  { value: 'Trichy',        label: 'Trichy'         },
  { value: 'Salem',         label: 'Salem'          },
  { value: 'Vellore',       label: 'Vellore'        },
  { value: 'Erode',         label: 'Erode'          },
  { value: 'Tirunelveli',   label: 'Tirunelveli'    },
  { value: 'Bangalore',     label: 'Bangalore'      },
  { value: 'Hyderabad',     label: 'Hyderabad'      },
  { value: 'Delhi',         label: 'Delhi'          },
  { value: 'Kolkata',       label: 'Kolkata'        },
];

const CUSTOMER_TYPE_OPTIONS = [
  { value: '',           label: '— Select Type —' },
  { value: 'individual', label: 'Individual'       },
  { value: 'business',   label: 'Business'         },
  { value: 'government', label: 'Government'       },
];

const STATUS_OPTIONS = ['active', 'inactive', 'pending'];

const EMPTY_FORM = {
  customer_name : '',
  mobile_number : '',
  email         : '',
  gender        : '',
  customer_type : '',
  locations     : [],    // multi-select (joined to `location` string on submit)
  address       : '',
  status        : 'active',
};


export default function CustomerForm({
  initialData   = {},
  onSubmit,
  mode          = 'create',
  loading       = false,
  serverError   = null,
  serverSuccess = null,
  onClear,
}) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when initial data changes (for update mode)
  useEffect(() => {
    if (mode === 'update' && initialData && Object.keys(initialData).length > 0) {
      setForm({
        customer_name : initialData.customer_name || '',
        mobile_number : initialData.mobile_number || '',
        email         : initialData.email         || '',
        gender        : initialData.gender        || '',
        customer_type : initialData.customer_type || '',
        locations     : initialData.location
          ? initialData.location.split(',').map((l) => l.trim()).filter(Boolean)
          : [],
        address       : initialData.address || '',
        status        : initialData.status  || 'active',
      });
      setErrors({});
    }
  }, [initialData, mode]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleLocationChange(selected) {
    setForm((prev) => ({ ...prev, locations: selected }));
  }

  function handleStatusSelect(val) {
    setForm((prev) => ({ ...prev, status: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validate = mode === 'create' ? validateCreateForm : validateUpdateForm;
    const errs     = validate(form);
    setErrors(errs);
    if (!isValid(errs)) return;

    // Build payload — convert locations array to comma-separated string
    const payload = {
      ...form,
      customer_name : form.customer_name.trim(),
      mobile_number : form.mobile_number.trim(),
      email         : form.email.trim().toLowerCase(),
      location      : form.locations.join(', ') || undefined,
    };
    delete payload.locations;

    // Remove empty strings for update mode (send only changed fields)
    if (mode === 'update') {
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '' || payload[k] === undefined) delete payload[k];
      });
    }

    onSubmit(payload);
  }

  function handleClear() {
    setForm(EMPTY_FORM);
    setErrors({});
    if (onClear) onClear();
  }

  const isUpdate = mode === 'update';

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── Server Messages ── */}
      {serverSuccess && (
        <Alert type="success" message={serverSuccess} className="mb-16" />
      )}
      {serverError && (
        <Alert type="error" message={serverError} className="mb-16" />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Row 1 — Name + Mobile */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="customer_name">
              Customer Name {!isUpdate && <span className="required">*</span>}
            </label>
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              className={`form-input ${errors.customer_name ? 'error' : ''}`}
              placeholder="e.g. Rajesh Kumar"
              value={form.customer_name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.customer_name && (
              <span className="field-error">⚠ {errors.customer_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mobile_number">
              Mobile Number {!isUpdate && <span className="required">*</span>}
            </label>
            <input
              id="mobile_number"
              name="mobile_number"
              type="tel"
              className={`form-input ${errors.mobile_number ? 'error' : ''}`}
              placeholder="10-digit number e.g. 9876543210"
              value={form.mobile_number}
              onChange={handleChange}
              maxLength={10}
              autoComplete="tel"
            />
            {errors.mobile_number ? (
              <span className="field-error">⚠ {errors.mobile_number}</span>
            ) : (
              <span className="field-hint">Exactly 10 digits, no spaces or dashes</span>
            )}
          </div>
        </div>

        {/* Row 2 — Email + Gender */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="email">
              Email Address {!isUpdate && <span className="required">*</span>}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="e.g. rajesh@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <span className="field-error">⚠ {errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group" style={{ marginTop: 8 }}>
              {[
                { value: 'male',   label: '♂ Male'   },
                { value: 'female', label: '♀ Female' },
                { value: 'other',  label: '○ Other'  },
              ].map((opt) => (
                <label key={opt.value} className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value={opt.value}
                    checked={form.gender === opt.value}
                    onChange={handleChange}
                  />
                  <span className="radio-label">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3 — Customer Type + Status */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="customer_type">Customer Type</label>
            <select
              id="customer_type"
              name="customer_type"
              className="form-select"
              value={form.customer_type}
              onChange={handleChange}
            >
              {CUSTOMER_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <div className="toggle-group">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`toggle-option ${form.status === s ? `${s}-opt` : ''}`}
                  onClick={() => handleStatusSelect(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4 — Location (multi-select) */}
        <div className="form-group">
          <label>Location</label>
          <MultiSelect
            options={LOCATION_OPTIONS}
            value={form.locations}
            onChange={handleLocationChange}
            placeholder="Select one or more cities…"
            error={!!errors.locations}
          />
          {errors.locations && (
            <span className="field-error">⚠ {errors.locations}</span>
          )}
          <span className="field-hint">You may select multiple locations</span>
        </div>

        {/* Row 5 — Address */}
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            className="form-textarea"
            placeholder="Full mailing address (optional)"
            value={form.address}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* ── Actions ── */}
        <div className="divider" />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={handleClear} disabled={loading}>
            Clear Form
          </button>
          <button type="submit" className="btn btn-primary btn-loading" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size={14} color="#fff" />
                {isUpdate ? 'Updating…' : 'Creating…'}
              </>
            ) : (
              isUpdate ? '✓ Update Customer' : '+ Create Customer'
            )}
          </button>
        </div>

      </div>
    </form>
  );
}
