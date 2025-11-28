import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

// Importamos las Vistas Específicas
import Home from './Home';           // Vista del Alumno (Radial)
import RoomProfesor from './RoomProfesor'; // Vista del Profesor (Dashboard) - ¡NUEVO!

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useLogin();

  // 1. Si no hay usuario, lo mandamos al inicio o mostramos error
  if (!user) {
    return (
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        background: '#46178f', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>No has iniciado sesión</h2>
        <p>Debes identificarte para entrar a una clase.</p>
        <div style={{ marginTop: 20 }}>
          <button 
            onClick={() => navigate('/login/alumno')} 
            style={{ padding: '10px 20px', marginRight: 10, cursor: 'pointer' }}
          >
            Soy Alumno
          </button>
          <button 
            onClick={() => navigate('/login/profesor')} 
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Soy Profesor
          </button>
        </div>
      </div>
    );
  }

  // 2. Detectar Rol
  const role = (user.tipo || user.role || '').toString().toUpperCase();

  // 3. Renderizar Vista Según Rol
  if (role === 'PROFESOR') {
    // Si es profe, cargamos el Dashboard de recepción de mensajes
    return <RoomProfesor roomId={roomId} />;
  } 
  
  if (role === 'ALUMNO') {
    // Si es alumno, cargamos el Menú Radial
    return <Home roomId={roomId} />;
  }

  // Si tiene un rol raro o desconocido
  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>
      Rol desconocido. Contacta al administrador.
    </div>
  );
}