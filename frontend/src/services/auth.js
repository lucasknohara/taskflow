import { authApi } from '../lib/api';

const AUTH_ME_PATH = import.meta.env.VITE_AUTH_ME_PATH?.trim() || '/me';

function unwrap(body) {
  return body?.data ?? body ?? {};
}

function normalizeUser(source = {}) {
  return {
    id: source.id,
    name: source.name ?? source.nome ?? '',
    email: source.email ?? '',
  };
}

function normalizeAuthResponse(body) {
  const payload = unwrap(body);
  const userSource = payload.user ?? payload;

  return {
    user: normalizeUser(userSource),
    accessToken: payload.accessToken ?? payload.token ?? null,
  };
}

export const authService = {
  async login({ email, password }) {
    // O back-end atual recebe "senha", enquanto o formulário usa "password".
    const { data } = await authApi.post('/login', {
      email: email.trim(),
      senha: password,
    });
    return normalizeAuthResponse(data);
  },

  async register({ name, email, password }) {
    // Adapta os nomes dos campos do front-end para o contrato atual do Express.
    const { data } = await authApi.post('/cadastro', {
      nome: name.trim(),
      email: email.trim(),
      senha: password,
    });
    return normalizeAuthResponse(data);
  },

  async me() {
    // A rota /me consulta o usuário autenticado e revalida a sessão ao recarregar o app.
    const { data } = await authApi.get(AUTH_ME_PATH);
    const payload = unwrap(data);
    return normalizeUser(payload.usuario ?? payload.user ?? payload.perfil ?? payload);
  },
};
