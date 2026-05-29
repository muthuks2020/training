import React from 'react';

const PAGE_META = {
  insert: { title: 'Insert Customer', subtitle: 'Add a new customer to the system' },
  update: { title: 'Update Customer', subtitle: 'Edit existing customer information' },
  delete: { title: 'Delete Customer', subtitle: 'Remove a customer record permanently' },
  search: { title: 'Search Customers', subtitle: 'Browse, filter and find customers' },
};

export const Header = ({ activePage }) => {
  const meta = PAGE_META[activePage] || PAGE_META.search;
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title">{meta.title}</div>
        <div className="header-subtitle">{meta.subtitle}</div>
      </div>
      <div className="header-right">
        <span className="header-badge">Enterprise</span>
      </div>
    </header>
  );
};
