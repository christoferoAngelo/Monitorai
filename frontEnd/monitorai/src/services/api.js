import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL padrão do Spring Boot
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Injeta o token aqui!
  }
  return config;
});

export default api;