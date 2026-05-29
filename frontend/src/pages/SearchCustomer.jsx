/**
 * pages/SearchCustomer.jsx
 * ------------------------
 * Advanced search and filter page with paginated results table.
 */

import React, { useState, useCallback } from 'react';
import Alert          from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import { searchCustomers, getAllCustomers } from '../api/customerApi';
import { getErrorMessage, formatDate, truncate } from '../utils/helpers';

const PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function SearchCustomer() {
  const [keyword,      setKeyword]      = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter,   setTypeFilter]   = useState('');
  const [page,         setPage]         = useState(1);
  const [perPage,      setPerPage]      = useState(10);

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [results,   setResults]   = useState(null);   // null = not searched yet
  const [searched,  setSearched]  = useState(false);

  // ── Run Search ─────────────────────────────────────────────────────────────
  const runSearch = useCallback(async (pg = 1) => {
    setLoading(true);
    setError(null);
    setPage(pg);

    try {
      let res;
      if (!keyword.trim() && !statusFilter && !typeFilter) {
        // No filters — get all
        res = await getAllCustomers(pg, perPage);
      } else {
        res = await searchCustomers({
          keyword,
          status:        statusFilter || undefined,
          customer_type: typeFilter   || undefined,
          page:          pg,
          per_page:      perPage,
        });
      }
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, typeFilter, perPage]);

  function handleSearch(e) {
    e.preventDefault();
    runSearch(1);
  }

  function handleReset() {
    setKeyword('');
    setStatusFilter('');
    setTypeFilter('');
    setPage(1);
    setResults(null);
    setSearched(false);
    setError(null);
  }

  const totalPages = results ? Math.ceil(results.total / perPage) : 0;

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-primary)', marginBottom: 4 }}>
          Search Customers
        </h2>
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          Search by name, mobile, email, or location — then filter by status and type.
        </p>
      </div>

      {/* ── Filter Card ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">
            <span className="card-title-icon">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
            </span>
            Search & Filter
          </span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              {/* Keyword */}
              <div className="search-bar" style={{ maxWidth: '100%', flex: '1 1 280px' }}>
                <svg className="search-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, mobile, email, location…"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="form-select"
                style={{ flex: '0 0 170px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              {/* Type Filter */}
              <select
                className="form-select"
                style={{ flex: '0 0 180px' }}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
                <option value="government">Government</option>
              </select>

              {/* Per page */}
              <select
                className="form-select"
                style={{ flex: '0 0 130px' }}
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); }}
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} per page</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary btn-loading" disabled={loading}>
                {loading ? (
                  <><LoadingSpinner size={13} color="#fff" /> Searching…</>
                ) : (
                  <>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                    </svg>
                    Search
                  </>
                )}
              </button>
              {searched && (
                <button type="button" className="btn btn-ghost" onClick={handleReset}>
                  ✕ Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── Error ── */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} style={{ marginBottom: 16 }} />}

      {/* ── Results Table ── */}
      {(searched || loading) && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <span className="card-title-icon">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              Results
            </span>

            {results && (
              <span style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>
                Showing {results.customers.length} of{' '}
                <strong style={{ color: 'var(--brand-primary)' }}>{results.total}</strong>{' '}
                customers
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <LoadingSpinner size={28} label="Loading customers…" />
            </div>
          ) : results?.customers?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No Customers Found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
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
                    {results?.customers?.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            background: 'var(--gray-100)',
                            color: 'var(--gray-600)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-sm)',
                          }}>
                            {c.id}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 13.5 }}>
                            {c.customer_name}
                          </div>
                          {c.gender && (
                            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 1 }}>
                              {c.gender}
                            </div>
                          )}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>
                          {c.mobile_number}
                        </td>
                        <td style={{ fontSize: 12.5, color: 'var(--brand-secondary)' }}>
                          {truncate(c.email, 30)}
                        </td>
                        <td><TypeBadge type={c.customer_type} /></td>
                        <td style={{ fontSize: 12.5 }}>{c.location || '—'}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td style={{ fontSize: 11.5, color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                          {formatDate(c.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="pagination">
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <div className="pagination-controls">
                    <button
                      className="page-btn"
                      disabled={page <= 1}
                      onClick={() => runSearch(1)}
                      title="First page"
                    >
                      «
                    </button>
                    <button
                      className="page-btn"
                      disabled={page <= 1}
                      onClick={() => runSearch(page - 1)}
                    >
                      ‹
                    </button>

                    {/* Page number buttons */}
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pg;
                      if (totalPages <= 7) {
                        pg = i + 1;
                      } else if (page <= 4) {
                        pg = i + 1;
                      } else if (page >= totalPages - 3) {
                        pg = totalPages - 6 + i;
                      } else {
                        pg = page - 3 + i;
                      }
                      return (
                        <button
                          key={pg}
                          className={`page-btn ${pg === page ? 'active' : ''}`}
                          onClick={() => runSearch(pg)}
                        >
                          {pg}
                        </button>
                      );
                    })}

                    <button
                      className="page-btn"
                      disabled={page >= totalPages}
                      onClick={() => runSearch(page + 1)}
                    >
                      ›
                    </button>
                    <button
                      className="page-btn"
                      disabled={page >= totalPages}
                      onClick={() => runSearch(totalPages)}
                      title="Last page"
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Not searched yet */}
      {!searched && !loading && !error && (
        <div className="card">
          <div className="empty-state" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon">🔍</div>
            <h3>Search or Browse Customers</h3>
            <p>Enter a search keyword, apply filters, or click <strong>Search</strong> with no filters to see all customers.</p>
          </div>
        </div>
      )}
    </div>
  );
}
