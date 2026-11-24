import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);
const TOKEN_KEY = 'taskflow.accessToken';
const USER_KEY = 'taskflow.user';

function readStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function persistSession({ user, accessToken }) {
  if (!accessToken) {
    throw new Error('A API não retornou o JWT. Verifique o retorno da rota de login.');
  }

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((current) => {
      const nextUser = { ...(current || {}), ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setBooting(false);
      return () => { active = false; };
    }

    // Consulta /me para validar o token e manter os dados do usuário sincronizados.
    const storedUser = readStoredUser();
    authService.me()
      .then((currentUser) => {
        if (!active) return;
        const sessionUser = currentUser || storedUser;
        setUser(sessionUser);
        if (currentUser) localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      })
      .catch((error) => {
          if (!active) return;
          
          if (error.response?.status === 401) {
              logout();
              return;
          }

          if (storedUser) {
              setUser(storedUser);
          }
      })
      .finally(() => {
        if (active) setBooting(false);
      });

    return () => { active = false; };
  }, [logout]);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('taskflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskflow:unauthorized', handleUnauthorized);
  }, [logout]);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    persistSession(result);
    setUser(result.user);
    return result.user;
  };

  const register = async (payload) => {
    const registration = await authService.register(payload);

    // O cadastro atual retorna apenas id/nome/email. Nesse caso, fazemos login
    // automaticamente para obter o JWT sem exigir mudanças no back-end agora.
    const session = registration.accessToken
      ? registration
      : await authService.login({ email: payload.email, password: payload.password });

    const authenticatedUser = session.user?.id ? session.user : registration.user;
    const completeSession = { ...session, user: authenticatedUser };
    persistSession(completeSession);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const value = useMemo(
    () => ({ user, booting, login, register, logout, updateUser }),
    [user, booting, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  return context;
}
