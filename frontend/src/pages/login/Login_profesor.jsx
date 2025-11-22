import './Login_profesor.css';
import LoginForm from '../../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export default function LoginProfesor() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <h1 className="login-title">Bienvenido, Profesor</h1>
      <LoginForm requiredRole="PROFESOR" redirectTo="/crear_clase" />
      <div>
        <button type="button" onClick={() => navigate('/crear_profesor')}>
          Registrarse
        </button>
      </div>
    </div>
  );
}
