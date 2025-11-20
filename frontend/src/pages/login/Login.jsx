import './Login.css';
import LoginForm from '../../components/LoginForm';

export default function Login() {
  return (
    <div className="login-page">
      <h1 className="login-title">Bienvenido a la app</h1>
      <LoginForm />
    </div>
  );
}
