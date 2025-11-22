import { useState, useEffect, useCallback } from 'react';
import { loginUser } from '../api/auth';

const STORAGE_KEY = 'pictotap_user';

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // Listen to auth broadcasts from other hook instances/tabs
  useEffect(() => {
    const handler = (ev) => {
      const u = ev?.detail?.user ?? null;
      setUser(u);
    };
    window.addEventListener('pictotap_auth', handler);
    // also listen to storage events (cross-tab)
    const storageHandler = (ev) => {
      if (ev.key === STORAGE_KEY) {
        try {
          setUser(ev.newValue ? JSON.parse(ev.newValue) : null);
        } catch (e) {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('pictotap_auth', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  const broadcast = (u) => {
    try {
      window.dispatchEvent(new CustomEvent('pictotap_auth', { detail: { user: u } }));
    } catch (e) {
      // ignore
    }
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      setUser(data);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
      broadcast(data);
      return data;
    } catch (e) {
      setError(e.message || 'Error en login');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    broadcast(null);
  }, []);

  return { login, loading, error, user, logout };
}
