import React, { useState } from 'react';
import { CustomerForm } from '../components/common/CustomerForm';
import { Spinner } from '../components/common/Spinner';
import { validateUpdateForm, hasErrors } from '../utils/validators';
import { getCustomerById, updateCustomer } from '../api/customerApi';

export const UpdateCustomer = ({ toast }) => {
  const [searchId, setSearchId]   = useState('');
  const [customer, setCustomer]   = useState(null);
  const [form,     setForm]       = useState({});
  const [errors,   setErrors]     = useState({});
  const [loading,  setLoading]    = useState(false);
  const [fetching, setFetching]   = useState(false);

  const handleFetch = async () => {
    if (!searchId || isNaN(searchId)) { toast.error('Enter a valid customer ID.'); return; }
    setFetching(true);
    try {
      const res = await getCustomerById(Number(searchId));
      const c   = res.data;
      setCustomer(c);
      setForm({
        customer_name: c.customer_name || '',
        mobile_number: c.mobile_number || '',
        email:         c.email         || '',
        gender:        c.gender        || '',
        customer_type: c.customer_type || 'individual',
        location:      c.location      || '',
        address:       c.address       || '',
        status:        c.status        || 'active',
      });
      setErrors({});
      toast.info(`Loaded: ${c.customer_name}`);
    } catch (err) {
      toast.error(err.message || 'Customer not found.');
      setCustomer(null);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  const handleUpdate = async () => {
    const errs = validateUpdateForm(form);
    if (hasErrors(errs)) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v != null) payload[k] = v; });
      await updateCustomer(customer.id, payload);
      toast.success('Customer updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update customer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content fade-in">
      {/* ID Lookup */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Find Customer</div>
            <div className="card-subtitle">Enter the customer ID to load their details</div>
          </div>
        </div>
        <div className="card-body">
          <div className="id-input-row">
            <div className="form-group">
              <label>Customer ID <span className="required">*</span></label>
              <input
                type="number" min="1"
                placeholder="e.g. 1"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetch()}
              />
            </div>
            <button className="btn btn-primary" onClick={handleFetch} disabled={fetching}>
              {fetching ? <Spinner /> : '⌕'} {fetching ? 'Loading…' : 'Load Customer'}
            </button>
          </div>
          {customer && (
            <div style={{
              background: 'var(--success-bg)', border: '1px solid var(--success)',
              borderRadius: 'var(--radius-sm)', padding: '10px 16px',
              fontSize: 13, color: 'var(--success)', display: 'flex', gap: 8, alignItems: 'center'
            }}>
              ✓ Editing: <strong>{customer.customer_name}</strong> (ID #{customer.id}) — {customer.email}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {customer && (
        <div className="card fade-in">
          <div className="card-header">
            <div>
              <div className="card-title">Edit Customer Details</div>
              <div className="card-subtitle">Modify the fields you want to update</div>
            </div>
          </div>
          <div className="card-body" style={{ position: 'relative' }}>
            {loading && <div className="loading-overlay"><Spinner size={32} /></div>}
            <CustomerForm form={form} errors={errors} onChange={handleChange} mode="update" />
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => { setCustomer(null); setSearchId(''); }}>Cancel</button>
              <button className="btn btn-gold btn-lg" onClick={handleUpdate} disabled={loading}>
                {loading ? <Spinner /> : null}
                {loading ? 'Updating…' : '✎  Update Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
