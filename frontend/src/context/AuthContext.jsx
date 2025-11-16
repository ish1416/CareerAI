import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'careerai_auth';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

class AuthManager {
  static saveAuth(token, user) {
    const authData = { token, user, timestamp: Date.now() };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  }
  
  static getAuth() {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
  
  static clearAuth() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  
  static isTokenExpiringSoon(timestamp) {
    return Date.now() - timestamp > TOKEN_REFRESH_THRESHOLD;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const auth = AuthManager.getAuth();
    return auth?.user || null;
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setRetryCount(0);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      AuthManager.saveAuth(data.token, data.user);
      setUser(data.user);
      return { 
        ok: true, 
        requiresVerification: data.requiresVerification || false,
        user: data.user 
      };
    } catch (e) {
      const error = e?.response?.data?.error || e.message || 'Login failed';
      return { ok: false, error, canRetry: !e?.response || e.response.status >= 500 };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      AuthManager.saveAuth(data.token, data.user);
      setUser(data.user);
      return { 
        ok: true, 
        requiresVerification: !data.user.emailVerified,
        user: data.user 
      };
    } catch (e) {
      const error = e?.response?.data?.error || e.message || 'Registration failed';
      return { ok: false, error, canRetry: !e?.response || e.response.status >= 500 };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout API errors
    } finally {
      AuthManager.clearAuth();
      setUser(null);
    }
  }, []);

  const reloadUser = useCallback(async () => {
    try {
      const { data } = await api.get('/user/profile');
      if (data?.user) {
        const auth = AuthManager.getAuth();
        if (auth) {
          AuthManager.saveAuth(auth.token, data.user);
        }
        setUser(data.user);
        return { ok: true, user: data.user };
      }
      return { ok: false, error: 'Profile not found' };
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error || e.message };
    }
  }, []);
  
  const retryLastAction = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);
  
  // Auto-refresh token when needed
  useEffect(() => {
    const auth = AuthManager.getAuth();
    if (auth && AuthManager.isTokenExpiringSoon(auth.timestamp)) {
      reloadUser();
    }
  }, [reloadUser]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      initialized, 
      retryCount,
      login, 
      register, 
      logout, 
      reloadUser,
      retryLastAction
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}