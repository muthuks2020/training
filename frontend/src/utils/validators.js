/**
 * utils/validators.js
 * --------------------
 * Frontend validation rules — mirrors backend rules for instant feedback.
 */

export const LOCATIONS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem',
  'Vellore', 'Tirunelveli', 'Erode', 'Mumbai', 'Pune',
  'Bangalore', 'Hyderabad', 'Delhi', 'Kolkata', 'Ahmedabad',
];

export const CUSTOMER_TYPES = [
  { value: 'individual',  label: 'Individual'  },
  { value: 'business',    label: 'Business'    },
  { value: 'government',  label: 'Government'  },
];

export const GENDER_OPTIONS = [
  { value: 'male',   label: 'Male'   },
  { value: 'female', label: 'Female' },
  { value: 'other',  label: 'Other'  },
];

export const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending',  label: 'Pending'  },
];

// ── Individual validators ──────────────────────────────────────

export const validateName = (v) => {
  if (!v || !v.trim()) return 'Customer name is required.';
  if (v.trim().length < 2) return 'Name must be at least 2 characters.';
  if (v.trim().length > 100) return 'Name cannot exceed 100 characters.';
  return null;
};

export const validateMobile = (v) => {
  if (!v || !v.trim()) return 'Mobile number is required.';
  if (!/^\d{10}$/.test(v.trim())) return 'Mobile must be exactly 10 digits (e.g. 9876543210).';
  return null;
};

export const validateEmail = (v) => {
  if (!v || !v.trim()) return 'Email address is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(v.trim())) return 'Enter a valid email address.';
  if (v.length > 150) return 'Email cannot exceed 150 characters.';
  return null;
};

export const validateLocations = (arr) => {
  if (!arr || arr.length === 0) return null; // optional
  return null;
};

// ── Full form validation ───────────────────────────────────────

export const validateCreateForm = (form) => {
  const errors = {};
  const nameErr   = validateName(form.customer_name);
  const mobErr    = validateMobile(form.mobile_number);
  const emailErr  = validateEmail(form.email);
  if (nameErr)  errors.customer_name  = nameErr;
  if (mobErr)   errors.mobile_number  = mobErr;
  if (emailErr) errors.email          = emailErr;
  return errors;
};

export const validateUpdateForm = (form) => {
  const errors = {};
  if (form.customer_name !== undefined) {
    const e = validateName(form.customer_name);
    if (e) errors.customer_name = e;
  }
  if (form.mobile_number !== undefined && form.mobile_number !== '') {
    const e = validateMobile(form.mobile_number);
    if (e) errors.mobile_number = e;
  }
  if (form.email !== undefined && form.email !== '') {
    const e = validateEmail(form.email);
    if (e) errors.email = e;
  }
  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
