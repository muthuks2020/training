/**
 * pages/Dashboard.jsx
 * -------------------
 * Home page with stats overview and recent customers.
 */

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert          from '../components/Alert';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import { getAllCustomers, searchCustomers } from '../api/customerApi';
import { formatDate } from '../utils/helpers';

export default function Dashboard({ onNavigate }) {
  const [stats,   setStats]   = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [all, active, inactive, pending] = await Promise.all([
          getAllCustomers(1, 1),
          searchCustomers({ status: 'active',   per_page: 1 }),
          searchCustomers({ status: 'inactive', per_page: 1 }),
          searchCustomers({ status: 'pending',  per_page: 1 }),
        ]);
        setStats({
          total:    all.data.total,
          active:   active.data.total,
          inactive: inactive.data.total,
          pending:  pending.data.total,
        });

        const recentRes = await getAllCustomers(1, 8);
        setRecent(recentRes.data.customers);
      } catch (err) {
        setError('Could not load dashboard data. Make sure the backend is running on port 8000.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Customers', value: stats.total,    icon: '👥', bg: '#dbeafe', color: '#1d4ed8' },
    { label: 'Active',          value: stats.active,   icon: '✅', bg: '#d1fae5', color: '#047857' },
    { label: 'Inactive',        value: stats.inactive, icon: '⛔', bg: '#fee2e2', color: '#b91c1c' },
    { label: 'Pending',         value: stats.pending,  icon: '⏳', bg: '#fef3c7', color: '#92400e' },
  ] : [];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <LoadingSpinner size={32} label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div>
      {/* ── Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: 24,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(26,60,94,0.25)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          right: -40,
          top: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          right: 80,
          bottom: -60,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
            Welcome to
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            Appasamy CRM Dashboard
          </h1>
          <p style={{ fontSize: 13.5, opacity: 0.8, marginTop: 6, fontWeight: 400 }}>
            Manage customers, track activity, and keep your data up to date.
          </p>
        </div>
        <div style={{ fontSize: 56, opacity: 0.6 }}>🏢</div>
      </div>

      {/* ── Error ── */}
      {error && <Alert type="warning" message={error} style={{ marginBottom: 20 }} />}

      {/* ── Stats Row ── */}
      {stats && (
        <div className="stats-row">
          {STAT_CARDS.map(({ label, value, icon, bg, color }) => (
            <div key={label} className="stat-card">
              <div className="stat-icon" style={{ background: bg, color }}>
                {icon}
              </div>
              <div className="stat-body">
                <div className="stat-value">{value.toLocaleString()}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '➕', title: 'Add Customer',    desc: 'Register a new customer in the system',      tab: 'insert',  color: 'var(--brand-secondary)', bg: 'var(--info-soft)'    },
          { icon: '✏️', title: 'Update Customer', desc: 'Edit existing customer details',             tab: 'update',  color: 'var(--warning)',         bg: 'var(--warning-soft)' },
          { icon: '🔍', title: 'Search Records',  desc: 'Filter and browse customer database',        tab: 'search',  color: 'var(--success)',         bg: 'var(--success-soft)' },
        ].map(({ icon, title, desc, tab, color, bg }) => (
          <button
            key={tab}
            onClick={() => onNavigate(tab)}
            style={{
              background: '#fff',
              border: '1.5px solid var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 200ms',
              boxShadow: 'var(--shadow-sm)',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: 40, height: 40,
              background: bg,
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              marginBottom: 12,
            }}>
              {icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
              {desc}
            </div>
          </button>
        ))}
      </div>

      {/* ── Recent Customers Table ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <span className="card-title-icon">🕐</span>
            Recent Customers
          </span>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('search')}>
            View All →
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <div className="empty-state-icon">📋</div>
            <h3>No Customers Yet</h3>
            <p>Start by adding your first customer.</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => onNavigate('insert')}>
              + Add First Customer
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Mobile</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11, fontWeight: 700,
                        background: 'var(--gray-100)',
                        color: 'var(--gray-600)',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        {c.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.customer_name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>{c.email}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{c.mobile_number}</td>
                    <td><TypeBadge type={c.customer_type} /></td>
                    <td style={{ fontSize: 12.5 }}>{c.location || '—'}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
