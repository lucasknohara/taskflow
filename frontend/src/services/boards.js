import api from '../lib/api';

function normalizeBoard(board = {}) {
  return {
    ...board,
    id: board.id,
    name: board.name ?? board.nome ?? '',
    description: board.description ?? board.descricao ?? '',
    ownerId: board.ownerId ?? board.id_usuario ?? null,
    updatedAt: board.updatedAt ?? board.updated_at ?? null,
  };
}

function unwrapBoard(body) {
  return body?.data?.board
    ?? body?.data?.quadro
    ?? body?.board
    ?? body?.quadro
    ?? body?.data
    ?? body;
}

export const boardsService = {
  async list(params = {}) {
    const { data } = await api.get('/quadros', { params });
    const items = data?.quadros ?? data?.data?.quadros ?? data?.data ?? [];
    return {
      data: Array.isArray(items) ? items.map(normalizeBoard) : [],
    };
  },

  async get(boardId) {
    const { data } = await api.get(`/quadros/${boardId}`);
    return normalizeBoard(unwrapBoard(data));
  },

  async create(payload) {
    const { data } = await api.post('/quadros', {
      nome: payload.name?.trim() ?? payload.nome,
      descricao: payload.description?.trim() ?? payload.descricao ?? '',
    });
    return normalizeBoard(unwrapBoard(data));
  },

  async update(boardId, payload) {
    const body = {};
    if (payload.name !== undefined || payload.nome !== undefined) {
      body.nome = (payload.name ?? payload.nome).trim();
    }
    if (payload.description !== undefined || payload.descricao !== undefined) {
      body.descricao = (payload.description ?? payload.descricao ?? '').trim();
    }

    const { data } = await api.put(`/quadros/${boardId}`, body);
    const returnedBoard = unwrapBoard(data);
    const hasBoardData = returnedBoard && typeof returnedBoard === 'object'
      && (returnedBoard.id !== undefined || returnedBoard.nome !== undefined || returnedBoard.name !== undefined);

    return hasBoardData
      ? normalizeBoard(returnedBoard)
      : {
          id: boardId,
          name: body.nome,
          description: body.descricao,
        };
  },

  async remove(boardId) {
    await api.delete(`/quadros/${boardId}`);
  },
};
