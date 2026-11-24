import api from '../lib/api';

const priorityToApi = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
};

function normalizePriority(value) {
  const normalized = String(value ?? 'Media')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalized === 'baixa' || normalized === 'low') return 'low';
  if (normalized === 'alta' || normalized === 'high') return 'high';
  return 'medium';
}

function normalizeDate(value) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

function normalizeCard(card = {}, fallback = {}) {
  return {
    ...fallback,
    ...card,
    id: card.id ?? fallback.id,
    columnId: card.columnId ?? card.id_coluna ?? fallback.columnId ?? null,
    title: card.title ?? card.titulo ?? fallback.title ?? '',
    description: card.description ?? card.descricao ?? fallback.description ?? '',
    priority: normalizePriority(card.priority ?? card.prioridade ?? fallback.priority),
    dueDate: normalizeDate(card.dueDate ?? card.data_entrega ?? fallback.dueDate),
    position: Number(card.position ?? card.posicao ?? fallback.position ?? 0),
  };
}

function unwrapCard(body) {
  return body?.data?.cartao
    ?? body?.cartao
    ?? body?.data?.card
    ?? body?.card
    ?? body?.data
    ?? body;
}

function toApiPayload(payload = {}) {
  const body = {};

  if (payload.title !== undefined || payload.titulo !== undefined) {
    body.titulo = (payload.title ?? payload.titulo ?? '').trim();
  }
  if (payload.description !== undefined || payload.descricao !== undefined) {
    body.descricao = (payload.description ?? payload.descricao ?? '').trim() || null;
  }
  if (payload.priority !== undefined || payload.prioridade !== undefined) {
    const priority = payload.priority ?? payload.prioridade;
    body.prioridade = priorityToApi[priority] ?? priority;
  }
  if (payload.dueDate !== undefined || payload.data_entrega !== undefined) {
    body.data_entrega = payload.dueDate ?? payload.data_entrega ?? null;
  }

  return body;
}

export const cardsService = {
  async list(columnId) {
    const { data } = await api.get(`/colunas/${columnId}/cartoes`);
    const items = Array.isArray(data)
      ? data
      : data?.cartoes ?? data?.data?.cartoes ?? data?.data ?? [];

    return Array.isArray(items)
      ? items.map((card) => normalizeCard(card)).sort((a, b) => a.position - b.position)
      : [];
  },

  async create(columnId, payload) {
    const { data } = await api.post(`/colunas/${columnId}/cartoes`, toApiPayload(payload));
    const card = unwrapCard(data);
    return normalizeCard(card, { ...payload, columnId });
  },

  async update(cardId, payload) {
    const { data } = await api.put(`/cartoes/${cardId}`, toApiPayload(payload));
    return normalizeCard(unwrapCard(data), { ...payload, id: cardId });
  },

  async remove(cardId) {
    await api.delete(`/cartoes/${cardId}`);
  },

  async move(cardId, targetColumnId, position) {
    const { data } = await api.patch(`/cartoes/${cardId}/mover`, {
      id_coluna_destino: targetColumnId,
      posicao_destino: position,
    });
    return data?.data ?? data;
  },
};
