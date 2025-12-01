import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Products API
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async (limit = 8) => {
  const response = await api.get('/products/featured', { params: { limit } });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const getBrands = async () => {
  const response = await api.get('/products/brands');
  return response.data;
};

export const getPriceRange = async () => {
  const response = await api.get('/products/price-range');
  return response.data;
};

export default api;
