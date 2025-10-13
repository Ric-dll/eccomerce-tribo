// arquivo: frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Aponta para o servidor
});

export default api;