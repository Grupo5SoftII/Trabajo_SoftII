import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_BASE } from "../../api/config";
import useLogin from "../../hooks/useLogin";
import "./RoomProfesor.css";

export default function RoomProfesor({ roomId }) {
  const navigate = useNavigate();
  const { user } = useLogin();
  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // Historial de interacciones
  const [activeStudents, setActiveStudents] = useState(new Set()); // Lista de alumnos online
  
  // Referencia para scroll automático
  const bottomRef = useRef(null);

  // --- CONEXIÓN SOCKET ---
  useEffect(() => {
    const newSocket = io(API_BASE);
    setSocket(newSocket);

    // 1. Unirse a la sala como PROFESOR
    newSocket.emit('join_room', { 
      room: roomId, 
      user: user 
    });

    // 2. Escuchar cuando alguien entra
    newSocket.on('user_joined', (data) => {
      // data.user contiene la info del alumno
      if (data.user && data.user.id !== user.id) {
        setActiveStudents(prev => new Set(prev).add(data.user.nombre || "Alumno"));
      }
    });

    // 3. Escuchar mensajes (Pictogramas o Emergencias)
    newSocket.on('receive_message', (data) => {
      try {
        // El alumno manda un string JSON, lo parseamos
        const content = JSON.parse(data.message); 
        
        const newInteraction = {
          id: Date.now(),
          time: new Date(),
          studentName: content.studentName || "Anónimo",
          type: content.type, // 'PICTOGRAMA' o 'EMERGENCIA'
          payload: content.content
        };

        setMessages((prev) => [...prev, newInteraction]);

        // Si es emergencia, alerta visual/sonora extra
        if (content.type === 'EMERGENCIA') {
          console.warn("ALERTA DE EMERGENCIA RECIBIDA");
        }

      } catch (e) {
        console.error("Error procesando mensaje:", e);
      }
    });

    return () => newSocket.close();
  }, [roomId, user]);

  // Auto-scroll cuando llega un mensaje nuevo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCloseClass = () => {
    if (window.confirm("¿Seguro que deseas cerrar la clase?")) {
      navigate('/crear_clase'); // Vuelve al panel de creación
    }
  };

  return (
    <div className="kahoot-layout room-layout">
      
      {/* HEADER DE LA CLASE */}
      <header className="room-header">
        <div className="header-left">
          <div className="pin-box">
            <span className="pin-label">PIN DE JUEGO:</span>
            <span className="pin-number">{roomId}</span>
          </div>
        </div>

        <div className="header-center">
          <h2 className="class-title">Panel de Control</h2>
        </div>

        <div className="header-right">
          <div className="student-counter">
            👤 {activeStudents.size}
          </div>
          <button className="btn-close-room" onClick={handleCloseClass}>
            Terminar
          </button>
        </div>
      </header>

      {/* FEED DE INTERACCIONES (GRILLA) */}
      <main className="feed-container">
        {messages.length === 0 ? (
          <div className="waiting-screen">
            <div className="pulse-icon">📡</div>
            <h3>Esperando a los alumnos...</h3>
            <p>Los pictogramas y alertas aparecerán aquí en tiempo real.</p>
          </div>
        ) : (
          <div className="interactions-grid">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`interaction-card ${msg.type === 'EMERGENCIA' ? 'card-emergency' : 'card-picto'}`}
              >
                <div className="card-top">
                  <span className="student-name">{msg.studentName}</span>
                  <span className="msg-time">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="card-content">
                  {msg.type === 'EMERGENCIA' ? (
                    <>
                      <div className="siren-icon">🚨</div>
                      <div className="emergency-text">{msg.payload}</div>
                    </>
                  ) : (
                    <div className="picto-display">
                      {/* Aquí mostramos el nombre del pictograma en grande */}
                      {msg.payload}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Decoración de fondo */}
      <div className="shape shape-circle"></div>
      <div className="shape shape-square"></div>
    </div>
  );
}