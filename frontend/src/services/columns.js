import api from '../lib/api';

export const columnsService = {
  async create(boardId, payload) {
    const { data } = await api.post(`/boards/${boardId}/columns`, payload);
    return data.data;
  },
  async update(columnId, payload) {
    const { data } = await api.patch(`/columns/${columnId}`, payload);
    return data.data;
  },
  async remove(columnId) {
    await api.delete(`/columns/${columnId}`);
  },
  async reorder(boardId, columnIds) {
    await api.patch(`/boards/${boardId}/columns/order`, { columnIds });
  },
};
