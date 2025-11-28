import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_BASE } from "../../api/config";
import useLogin from "../../hooks/useLogin";
import PictoView from "../../components/PictoView";
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
      // A. Identificar IDs
      const incomingId = data.user?.id || data.userId;
      const myId = user?.id;

      // B. FILTRO DE SEGURIDAD: 
      if (incomingId == myId) return;

      console.log("📢 ALGUIEN SE UNIÓ:", data);
      
      // C. Obtener el nombre real (prioridad: nombre > usuario > "Estudiante")
      const studentName = data.user?.nombre || data.user?.usuario || "Estudiante";

      // D. Actualizar contador de alumnos únicos
      setActiveStudents(prev => new Set(prev).add(studentName));

      // E. Mostrar tarjeta SOLO si pasó el filtro (es decir, es un alumno real)
      setMessages((prev) => [...prev, {
        id: Date.now(),
        time: new Date(),
        studentName: "SISTEMA", 
        type: 'JOIN',           
        payload: `${studentName} se ha unido a la clase.`
      }]);
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
                className={`interaction-card ${
                  msg.type === 'EMERGENCIA' ? 'card-emergency' : 
                  msg.type === 'JOIN' ? 'card-join' : 'card-picto'
                }`}
              >
                <div className="card-top">
                  <span className="student-name">{msg.studentName}</span>
                  <span className="msg-time">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="card-content">
                  {/* CASO 1: EMERGENCIA */}
                  {msg.type === 'EMERGENCIA' && (
                    <>
                      <div className="siren-icon">🚨</div>
                      <div className="emergency-text">{msg.payload}</div>
                    </>
                  )}

                  {/* CASO 2: UNIÓN (NUEVO) */}
                  {msg.type === 'JOIN' && (
                    <div className="join-text">
                      👋 {msg.payload}
                    </div>
                  )}

                  {/* CASO 3: PICTOGRAMA NORMAL */}
                  {(msg.type !== 'EMERGENCIA' && msg.type !== 'JOIN') && (
                    <div className="picto-display-wrapper">
                       {/* Debe ser PictoView, NO un div con texto */}
                       <PictoView term={msg.payload} />
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