import './Login_profesor.css';
import LoginForm from '../../components/LoginForm';

export default function LoginProfesor() {
  return (
    <div className="login-page">
      <h1 className="login-title">Bienvenido, Profesor</h1>
      <LoginForm />
    </div>
  );
}
