import api from '../lib/api';

export const authService = {
  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    return data.data;
  },
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data.data;
  },
  async me() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
};
