import { useState, useCallback } from 'react';
import * as api from '../api/customerApi';
export const useCustomers = () => {
  const [loading, setLoading]     = useState(false);
  const [customers, setCustomers] = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const perPage = 10;
  const fetchAll = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.getAllCustomers(p, perPage);
      setCustomers(res.data.customers); setTotal(res.data.total); setPage(p);
    } finally { setLoading(false); }
  }, []);
  const search = useCallback(async (params) => {
    setLoading(true);
    try {
      const res = await api.searchCustomers({ ...params, per_page: perPage });
      setCustomers(res.data.customers); setTotal(res.data.total); setPage(params.page || 1);
    } finally { setLoading(false); }
  }, []);
  return { loading, customers, total, page, perPage, fetchAll, search };
};
