import axios from 'axios';

// Base API handler configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure Axios Request interceptor to attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure Response interceptor to format error handlers
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong with connection.';
    console.error(`[API Error]: ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default api;
