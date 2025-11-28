import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import './Login_profesor.css';

export default function LoginProfesor() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/crear_profesor');
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

        <div className="kahoot-card login-card-teacher">
          <h2 className="login-heading">Profesor</h2>
          <p className="login-subtext">Gestiona tus clases y alumnos</p>

          {/* Formulario */}
          <div className="form-wrapper">
            {/* AQUÍ ESTÁ EL CAMBIO: Redirige a '/crear_clase' */}
            <LoginForm 
              requiredRole="PROFESOR" 
              onSuccess={() => navigate('/crear_clase')} 
            />
          </div>

          <div className="divider">
            <span>o</span>
          </div>

          {/* Botón de Registro */}
          <button type="button" className="btn-register-link" onClick={handleRegister}>
            ¿Eres nuevo? <strong>Regístrate como Profesor</strong>
          </button>
        </div>
      </main>

      {/* Formas de fondo */}
      <div className="shape shape-circle"></div>
      <div className="shape shape-square"></div>
      <div className="shape shape-triangle"></div>
    </div>
  );
}