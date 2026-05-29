import React, { useState } from 'react';
import './styles/globals.css';
import { Sidebar }         from './components/layout/Sidebar';
import { Header }          from './components/layout/Header';
import { ToastContainer }  from './components/common/Toast';
import { InsertCustomer }  from './pages/InsertCustomer';
import { UpdateCustomer }  from './pages/UpdateCustomer';
import { DeleteCustomer }  from './pages/DeleteCustomer';
import { SearchCustomers } from './pages/SearchCustomers';
import { useToast }        from './hooks/useToast';

const PAGES = {
  insert: InsertCustomer,
  update: UpdateCustomer,
  delete: DeleteCustomer,
  search: SearchCustomers,
};

function App() {
  const [activePage, setActivePage] = useState('search');
  const toast = useToast();
  const PageComponent = PAGES[activePage] || SearchCustomers;

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <Header activePage={activePage} />
        <PageComponent toast={toast} />
      </div>
      <ToastContainer toasts={toast.toasts} />
    </div>
  );
}

export default App;
