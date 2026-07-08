import axios from 'axios';

// Base API handler configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate or retrieve a client-side UUID for per-user fan profile isolation.
 * This is NOT auth — it's a session discriminator that prevents two browsers
 * from overwriting each other's profile in the shared in-memory backend store.
 */
function getFanSessionId() {
  let id = localStorage.getItem('wc_session_id');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('wc_session_id', id);
  }
  return id;
}

// Attach the fan session UUID on every outgoing request
api.interceptors.request.use(
  (config) => {
    config.headers['x-fan-session-id'] = getFanSessionId();
    return config;
  },
  (error) => Promise.reject(error)
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

