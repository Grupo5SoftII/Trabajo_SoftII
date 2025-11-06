import { useState } from 'react';
import useLogin from '../hooks/useLogin';
import './LoginForm.css';

export default function LoginForm() {
  const { login, loading, error } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      // redirigir al dashboard, por ejemplo con useNavigate
    } catch (e) {
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
      {error && <p className="error">{error}</p>}
    </form>
  );
}
