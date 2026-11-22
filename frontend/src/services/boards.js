import api from '../lib/api';

export const boardsService = {
  async list(params = {}) {
    const { data } = await api.get('/boards', { params });
    return data;
  },
  async get(boardId) {
    const { data } = await api.get(`/boards/${boardId}`);
    return data.data;
  },
  async create(payload) {
    const { data } = await api.post('/boards', payload);
    return data.data;
  },
  async update(boardId, payload) {
    const { data } = await api.patch(`/boards/${boardId}`, payload);
    return data.data;
  },
  async remove(boardId) {
    await api.delete(`/boards/${boardId}`);
  },
};
