import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // 🔐 habilita el uso de cookies
});

export default api;
