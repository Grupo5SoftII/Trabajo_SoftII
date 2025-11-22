import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import './LoginForm.css';

export default function LoginForm({ requiredRole = null, redirectTo = '/dashboard', onSuccess = null }) {
  const { login, loading, error: hookError } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login({ username, password, role: requiredRole });
      // backend already restricts role to PROFESOR, but double-check if requiredRole provided
      if (requiredRole && ((user.tipo || '').toUpperCase() !== requiredRole.toUpperCase())) {
        setError('Acceso restringido: se requiere rol ' + requiredRole);
        return;
      }
      // On successful login, call onSuccess callback if provided, otherwise navigate
      if (typeof onSuccess === 'function') {
        try {
          onSuccess(user);
        } catch (cbErr) {
          console.error('onSuccess callback error', cbErr);
          navigate(redirectTo);
        }
      } else {
        navigate(redirectTo);
      }
    } catch (e) {
      setError(e.message || 'Error en login');
      console.error(e);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Usuario" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Contraseña" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </button>
      {(error || hookError) && <p className="error">{error || hookError}</p>}
    </form>
  );
}
