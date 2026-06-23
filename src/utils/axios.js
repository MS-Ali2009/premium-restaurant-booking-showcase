import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for future API integration
api.interceptors.request.use(
  (config) => {
    // Placeholder: attach auth token here
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Placeholder: handle global errors (401 redirect, toast notifications, etc.)
    return Promise.reject(error);
  }
);

export default api;
