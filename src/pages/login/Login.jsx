import LoginForm from '../../components/LoginForm';
import './Login.css';

export default function Login() {
  return (
    <div className="login-page">
      <h1>Bienvenido a la app</h1>
      <LoginForm />
    </div>
  );
}
