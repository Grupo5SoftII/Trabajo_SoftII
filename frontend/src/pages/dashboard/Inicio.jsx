import React from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";

export default function Inicio() {
  const navigate = useNavigate();

  const goLoginAlumno = () => navigate('/login/alumno');
  const goLoginProfesor = () => navigate('/login/profesor');

  return (
    <div className="kahoot-layout">
      
      {/* CONTENIDO CENTRAL */}
      <main className="kahoot-center">
        {/* LOGO / TÍTULO */}
        <h1 className="pictotap-logo">PICTOTAP</h1>

        {/* TARJETA DE SELECCIÓN */}
        <div className="kahoot-card">
          <h2 className="welcome-text">¡Bienvenido!</h2>
          <p className="subtitle-text">Selecciona tu perfil para ingresar:</p>
          
          <div className="action-buttons">
            <button className="kahoot-btn-role btn-student" onClick={goLoginAlumno}>
              Soy Estudiante
            </button>
            
            <button className="kahoot-btn-role btn-teacher" onClick={goLoginProfesor}>
              Soy Profesor
            </button>
          </div>
        </div>
        
        <p className="footer-text">
          Comunicación aumentativa en el aula
        </p>
      </main>
      
      {/* Formas geométricas de fondo */}
      <div className="shape shape-circle"></div>
      <div className="shape shape-square"></div>
      <div className="shape shape-triangle"></div>
    </div>
  );
}