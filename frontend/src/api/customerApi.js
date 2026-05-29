/**
 * api/customerApi.js
 * ------------------
 * Centralised API calls to the FastAPI backend.
 */

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.detail  ||
      error?.message                 ||
      'An unexpected error occurred.';
    return Promise.reject({ message: msg, raw: error });
  }
);

export const createCustomer  = async (payload)           => { const { data } = await api.post('/customers/', payload); return data; };
export const getAllCustomers  = async (page=1, perPage=10) => { const { data } = await api.get('/customers/', { params: { page, per_page: perPage } }); return data; };
export const getCustomerById = async (id)                 => { const { data } = await api.get(`/customers/${id}`); return data; };
export const updateCustomer  = async (id, payload)        => { const { data } = await api.put(`/customers/${id}`, payload); return data; };
export const deleteCustomer  = async (id)                 => { const { data } = await api.delete(`/customers/${id}`); return data; };
export const searchCustomers = async (params={})          => { const { data } = await api.get('/customers/search', { params }); return data; };

export default api;
