import React, { useState } from 'react';
import { Spinner } from '../components/common/Spinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge, TypeBadge } from '../components/common/Badge';
import { getCustomerById, deleteCustomer } from '../api/customerApi';

export const DeleteCustomer = ({ toast }) => {
  const [searchId, setSearchId]   = useState('');
  const [customer, setCustomer]   = useState(null);
  const [fetching, setFetching]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [confirm,  setConfirm]    = useState(false);

  const handleFetch = async () => {
    if (!searchId || isNaN(searchId)) { toast.error('Enter a valid customer ID.'); return; }
    setFetching(true);
    try {
      const res = await getCustomerById(Number(searchId));
      setCustomer(res.data);
    } catch (err) {
      toast.error(err.message || 'Customer not found.');
      setCustomer(null);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCustomer(customer.id);
      toast.success(`Customer "${customer.customer_name}" deleted successfully.`);
      setCustomer(null);
      setSearchId('');
      setConfirm(false);
    } catch (err) {
      toast.error(err.message || 'Failed to delete customer.');
    } finally {
      setLoading(false);
    }
  };

  const Row = ({ label, value }) => (
    <tr>
      <td style={{ padding: '10px 0', color: 'var(--gray-400)', fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: 160 }}>{label}</td>
      <td style={{ padding: '10px 0', color: 'var(--gray-800)', fontSize: 14 }}>{value || '—'}</td>
    </tr>
  );

  return (
    <div className="page-content fade-in">
      {confirm && customer && (
        <ConfirmDialog
          title="Delete Customer?"
          message={`This will permanently delete "${customer.customer_name}" (ID #${customer.id}). This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(false)}
          loading={loading}
        />
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Find Customer to Delete</div>
            <div className="card-subtitle">Enter the customer ID to preview their record</div>
          </div>
        </div>
        <div className="card-body">
          <div className="id-input-row">
            <div className="form-group">
              <label>Customer ID <span className="required">*</span></label>
              <input type="number" min="1" placeholder="e.g. 3"
                value={searchId} onChange={e => setSearchId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetch()}
              />
            </div>
            <button className="btn btn-primary" onClick={handleFetch} disabled={fetching}>
              {fetching ? <Spinner /> : '⌕'} {fetching ? 'Searching…' : 'Find Customer'}
            </button>
          </div>
        </div>
      </div>

      {customer && (
        <div className="card fade-in">
          <div className="card-header" style={{ background: 'var(--error-bg)', borderColor: 'rgba(192,57,43,.15)' }}>
            <div>
              <div className="card-title" style={{ color: 'var(--error)' }}>⚠ Record Pending Deletion</div>
              <div className="card-subtitle">Review all details before proceeding</div>
            </div>
          </div>
          <div className="card-body">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row label="ID"            value={`#${customer.id}`} />
                <Row label="Name"          value={customer.customer_name} />
                <Row label="Mobile"        value={customer.mobile_number} />
                <Row label="Email"         value={customer.email} />
                <Row label="Gender"        value={customer.gender} />
                <Row label="Type"          value={<TypeBadge value={customer.customer_type} />} />
                <Row label="Location"      value={customer.location} />
                <Row label="Status"        value={<StatusBadge value={customer.status} />} />
                <Row label="Created At"    value={customer.created_at ? new Date(customer.created_at).toLocaleString() : '—'} />
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => { setCustomer(null); setSearchId(''); }}>Cancel</button>
              <button className="btn btn-danger btn-lg" onClick={() => setConfirm(true)}>
                ✕  Delete This Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
