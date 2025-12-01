import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5002/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[Axios Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Axios Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Axios Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
