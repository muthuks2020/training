import React from 'react';

const NAV_ITEMS = [
  { id: 'insert', icon: '＋', label: 'Insert Customer' },
  { id: 'update', icon: '✎', label: 'Update Customer' },
  { id: 'delete', icon: '✕', label: 'Delete Customer' },
  { id: 'search', icon: '⌕', label: 'Search Customers' },
];

export const Sidebar = ({ activePage, onNavigate }) => (
  <aside className="sidebar">
    <div className="sidebar-logo">
      {/* ✅ Logo from public/assets/appasamy-logo.png */}
      <img
        src="/assets/appasamy-logo.png"
        alt="Appasamy Logo"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>

    <nav className="sidebar-nav">
      <div className="nav-section-label">Operations</div>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon" style={{ fontSize: 16 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>

    <div className="sidebar-footer">
      <div style={{ marginBottom: 4, fontWeight: 600, color: 'rgba(255,255,255,.5)', fontSize: 10 }}>
        APPASAMY ASSOCIATES
      </div>
      Customer Management System v1.0
      <br />
      FastAPI + React | Training Demo
    </div>
  </aside>
);
