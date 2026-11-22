import api from '../lib/api';

function normalizeColumn(column = {}, boardId = null) {
  return {
    ...column,
    id: column.id,
    boardId: column.boardId ?? column.id_quadro ?? boardId,
    name: column.name ?? column.nome ?? '',
    position: Number(column.position ?? column.posicao ?? 0),
    cards: Array.isArray(column.cards) ? column.cards : [],
  };
}

function unwrapColumn(body) {
  return body?.data?.coluna ?? body?.coluna ?? body?.data ?? body;
}

export const columnsService = {
  async list(boardId) {
    const { data } = await api.get(`/quadros/${boardId}/colunas`);
    const items = data?.colunas ?? data?.data?.colunas ?? data?.data ?? [];
    return Array.isArray(items) ? items.map((column) => normalizeColumn(column, boardId)) : [];
  },

  async create(boardId, payload) {
    const name = (payload.name ?? payload.nome ?? '').trim();
    const position = Number(payload.position ?? payload.posicao ?? 0);
    const { data } = await api.post(`/quadros/${boardId}/colunas`, {
      nome: name,
      posicao: position,
    });
    return normalizeColumn(unwrapColumn(data), boardId);
  },

  async update(columnId, payload) {
    const name = (payload.name ?? payload.nome ?? '').trim();
    await api.put(`/colunas/${columnId}`, { nome: name });
    return { id: columnId, name };
  },

  async remove(columnId) {
    await api.delete(`/colunas/${columnId}`);
  },
};
