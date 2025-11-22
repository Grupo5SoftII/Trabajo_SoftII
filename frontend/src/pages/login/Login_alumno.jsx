import './Login_alumno.css';
import LoginForm from '../../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export default function LoginAlumno() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/crear_alumno');
  };

  return (
    <div className="login-page">
      <h1 className="login-title">Bienvenido, Alumno</h1>
      <LoginForm requiredRole="ALUMNO" />

      <div style={{ width: '100%', maxWidth: 420, marginTop: 12 }}>
        <button type="button" onClick={handleRegister}>
          Registrarse
        </button>
      </div>
    </div>
  );
}
