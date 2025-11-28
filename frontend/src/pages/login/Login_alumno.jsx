import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import './Login_alumno.css';

export default function LoginAlumno() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/crear_alumno');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="kahoot-layout">
      {/* Botón flotante para volver */}
      <button className="btn-back" onClick={handleBack}>
        ← Volver
      </button>

      <main className="kahoot-center">
        {/* Logo */}
        <h1 className="pictotap-logo-small">PICTOTAP</h1>

        <div className="kahoot-card login-card-student">
          <h2 className="login-heading">Estudiante</h2>
          <p className="login-subtext">Ingresa tus credenciales</p>

          {/* Formulario */}
          <div className="form-wrapper">
            {/* AQUÍ ESTÁ EL CAMBIO: Redirige a '/home' al loguearse */}
            <LoginForm 
              requiredRole="ALUMNO" 
              onSuccess={() => navigate('/home')} 
            />
          </div>

          <div className="divider">
            <span>o</span>
          </div>

          {/* Botón de Registro */}
          <button type="button" className="btn-register-link" onClick={handleRegister}>
            ¿No tienes cuenta? <strong>Regístrate aquí</strong>
          </button>
        </div>
      </main>

      {/* Formas de fondo */}
      <div className="shape shape-circle"></div>
      <div className="shape shape-square"></div>
    </div>
  );
}