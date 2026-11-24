import { authApi } from '../lib/api';

function unwrap(body) {
  return body?.data ?? body ?? {};
}

function normalizeProfile(body = {}) {
  const payload = unwrap(body);
  const source = payload.usuario ?? payload.user ?? payload.perfil ?? payload;

  return {
    id: source.id,
    name: source.name ?? source.nome ?? '',
    email: source.email ?? '',
    createdAt: source.createdAt ?? source.criado_em ?? source.created_at ?? source.data_cadastro ?? null,
  };
}

export const profileService = {
  async getMe() {
    const { data } = await authApi.get('/me');
    return normalizeProfile(data);
  },

  async updateMe({ name, email }) {
    const payload = {
      nome: name.trim(),
      email: email.trim(),
    };

    const { data } = await authApi.patch('/me', payload);
    const updated = normalizeProfile(data);

    // Algumas APIs retornam somente uma mensagem após o PATCH.
    return {
      ...updated,
      name: updated.name || payload.nome,
      email: updated.email || payload.email,
    };
  },
};
