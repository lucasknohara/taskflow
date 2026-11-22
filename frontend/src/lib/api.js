import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow.accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRequest = /\/auth\/(login|register)$/.test(error.config?.url || '');
      if (!isAuthRequest) {
        localStorage.removeItem('taskflow.accessToken');
        window.dispatchEvent(new CustomEvent('taskflow:unauthorized'));
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error, fallback = 'Não foi possível concluir a operação.') {
  return error.response?.data?.error?.message
    || error.response?.data?.message
    || (error.code === 'ECONNABORTED' ? 'A requisição demorou demais. Tente novamente.' : null)
    || (!error.response ? 'Não foi possível conectar à API. Verifique se o servidor está ativo.' : null)
    || fallback;
}

export default api;
