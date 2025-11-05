import { useState } from 'react';
import { loginUser } from '../api/auth';

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      setUser(data); // guardar info de usuario / token
      return data;
    } catch (e) {
      setError(e.message || 'Error en login');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, user };
}
