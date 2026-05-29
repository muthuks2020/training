import React, { useState } from 'react';
import { CustomerForm } from '../components/common/CustomerForm';
import { Spinner } from '../components/common/Spinner';
import { validateCreateForm, hasErrors } from '../utils/validators';
import { createCustomer } from '../api/customerApi';

const EMPTY = {
  customer_name: '', mobile_number: '', email: '',
  gender: '', customer_type: 'individual',
  location: '', address: '', status: 'active',
};

export const InsertCustomer = ({ toast }) => {
  const [form,    setForm]    = useState({ ...EMPTY });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  const handleSubmit = async () => {
    const errs = validateCreateForm(form);
    if (hasErrors(errs)) { setErrors(errs); return; }

    setLoading(true);
    try {
      await createCustomer({
        ...form,
        customer_name: form.customer_name.trim(),
        mobile_number: form.mobile_number.trim(),
        email: form.email.trim().toLowerCase(),
        gender: form.gender || undefined,
        location: form.location || undefined,
        address: form.address || undefined,
      });
      toast.success('Customer created successfully!');
      setForm({ ...EMPTY });
      setErrors({});
    } catch (err) {
      toast.error(err.message || 'Failed to create customer.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setForm({ ...EMPTY }); setErrors({}); };

  return (
    <div className="page-content fade-in">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">New Customer Registration</div>
            <div className="card-subtitle">Fields marked with * are required</div>
          </div>
        </div>
        <div className="card-body" style={{ position: 'relative' }}>
          {loading && <div className="loading-overlay"><Spinner size={32} /></div>}
          <CustomerForm form={form} errors={errors} onChange={handleChange} mode="create" />
          <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={handleReset} disabled={loading}>Reset</button>
            <button className="btn btn-gold btn-lg" onClick={handleSubmit} disabled={loading}>
              {loading ? <Spinner /> : null}
              {loading ? 'Saving…' : '✓  Save Customer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
