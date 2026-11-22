import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);
const TOKEN_KEY = 'taskflow.accessToken';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setBooting(false);
      return () => { active = false; };
    }

    authService.me()
      .then((currentUser) => { if (active) setUser(currentUser); })
      .catch(() => { if (active) logout(); })
      .finally(() => { if (active) setBooting(false); });

    return () => { active = false; };
  }, [logout]);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('taskflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskflow:unauthorized', handleUnauthorized);
  }, [logout]);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, result.accessToken);
    setUser(result.user);
    return result.user;
  };

  const register = async (payload) => {
    const result = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, result.accessToken);
    setUser(result.user);
    return result.user;
  };

  const value = useMemo(() => ({ user, booting, login, register, logout }), [user, booting, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  return context;
}
