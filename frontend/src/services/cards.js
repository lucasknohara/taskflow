import api from '../lib/api';

export const cardsService = {
  async create(columnId, payload) {
    const { data } = await api.post(`/columns/${columnId}/cards`, payload);
    return data.data;
  },
  async get(cardId) {
    const { data } = await api.get(`/cards/${cardId}`);
    return data.data;
  },
  async update(cardId, payload) {
    const { data } = await api.patch(`/cards/${cardId}`, payload);
    return data.data;
  },
  async remove(cardId) {
    await api.delete(`/cards/${cardId}`);
  },
  async move(cardId, targetColumnId, position) {
    const { data } = await api.patch(`/cards/${cardId}/move`, { targetColumnId, position });
    return data.data;
  },
};
