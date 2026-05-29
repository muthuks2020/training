import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from '../components/common/Spinner';
import { StatusBadge, TypeBadge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { searchCustomers } from '../api/customerApi';

const STATUS_OPTS  = [{ value: '', label: 'All Statuses' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'pending', label: 'Pending' }];
const TYPE_OPTS    = [{ value: '', label: 'All Types' }, { value: 'individual', label: 'Individual' }, { value: 'business', label: 'Business' }, { value: 'government', label: 'Government' }];

export const SearchCustomers = ({ toast }) => {
  const [keyword,    setKeyword]   = useState('');
  const [statusF,    setStatusF]   = useState('');
  const [typeF,      setTypeF]     = useState('');
  const [customers,  setCustomers] = useState([]);
  const [total,      setTotal]     = useState(0);
  const [page,       setPage]      = useState(1);
  const [loading,    setLoading]   = useState(false);
  const [searched,   setSearched]  = useState(false);
  const PER_PAGE = 10;

  const doSearch = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, per_page: PER_PAGE };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (statusF)        params.status  = statusF;
      if (typeF)          params.customer_type = typeF;
      const res = await searchCustomers(params);
      setCustomers(res.data.customers);
      setTotal(res.data.total);
      setPage(p);
      setSearched(true);
    } catch (err) {
      toast.error(err.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  }, [keyword, statusF, typeF, toast]);

  // Auto-search on mount
  useEffect(() => { doSearch(1); }, []); // eslint-disable-line

  const handleSearch = () => doSearch(1);
  const handleReset  = () => { setKeyword(''); setStatusF(''); setTypeF(''); setTimeout(() => doSearch(1), 50); };

  return (
    <div className="page-content fade-in">
      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 240px' }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Search</label>
              <div className="search-bar-wrapper" style={{ maxWidth: '100%' }}>
                <span className="search-icon">⌕</span>
                <input type="text" placeholder="Name, mobile, email, location…"
                  value={keyword} onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div style={{ flex: '0 0 160px' }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Status</label>
              <select value={statusF} onChange={e => setStatusF(e.target.value)}>
                {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div style={{ flex: '0 0 160px' }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Customer Type</label>
              <select value={typeF} onChange={e => setTypeF(e.target.value)}>
                {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                {loading ? <Spinner /> : '⌕'} Search
              </button>
              <button className="btn btn-outline" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Results</div>
            <div className="card-subtitle">
              {searched ? `${total} customer${total !== 1 ? 's' : ''} found` : 'Run a search above'}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
            <Spinner size={32} />
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No customers found</div>
            <div className="empty-text">Try adjusting your search filters</div>
          </div>
        ) : (
          <>
            <div className="table-wrapper" style={{ borderRadius: 0, border: 'none', borderTop: 'var(--border-light)' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-400)' }}>#{c.id}</span></td>
                      <td><strong style={{ color: 'var(--brand-navy)' }}>{c.customer_name}</strong></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{c.mobile_number}</td>
                      <td style={{ color: 'var(--gray-600)', fontSize: 13 }}>{c.email}</td>
                      <td><TypeBadge value={c.customer_type} /></td>
                      <td style={{ color: 'var(--gray-600)', fontSize: 13 }}>{c.location || '—'}</td>
                      <td><StatusBadge value={c.status} /></td>
                      <td style={{ color: 'var(--gray-400)', fontSize: 12 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} total={total} perPage={PER_PAGE} onChange={(p) => doSearch(p)} />
          </>
        )}
      </div>
    </div>
  );
};
