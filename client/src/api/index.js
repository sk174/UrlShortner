import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('tinyurl_user');
  if (user) {
    const parsed = JSON.parse(user);
    config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// URLs
export const shortenUrl = (data) => API.post('/url/shorten', data);
export const getMyUrls = () => API.get('/url/my-urls');
export const deleteUrl = (id) => API.delete(`/url/${id}`);
