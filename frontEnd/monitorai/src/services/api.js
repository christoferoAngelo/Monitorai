import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL padrão do Spring Boot
});

// Isso aqui vai enviar o Token JWT automaticamente em cada requisição depois do login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;