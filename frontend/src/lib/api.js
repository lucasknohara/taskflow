import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || `${API_URL.replace(/\/+$/, '')}/usuarios`;
const TOKEN_KEY = 'taskflow.accessToken';
const USER_KEY = 'taskflow.user';

function createApiClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const requestPath = error.config?.url || '';
        const isAuthRequest = /\/(login|cadastro|register)$/.test(requestPath);

        // Credenciais incorretas no login não devem apagar uma sessão existente.
        if (!isAuthRequest) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.dispatchEvent(new CustomEvent('taskflow:unauthorized'));
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
}

// Cliente das rotas de quadros, listas e cartões.
const api = createApiClient(API_URL);

// Cliente separado porque a rota atual de autenticação está em /usuarios.
const authApi = createApiClient(AUTH_API_URL);

export function getErrorMessage(error, fallback = 'Não foi possível concluir a operação.') {
  return error.response?.data?.error?.message
    || error.response?.data?.message
    || (error.code === 'ECONNABORTED' ? 'A requisição demorou demais. Tente novamente.' : null)
    || (error.isAxiosError && !error.response ? 'Não foi possível conectar à API. Verifique se o servidor está ativo.' : null)
    || error.message
    || fallback;
}

export { authApi };
export default api;
