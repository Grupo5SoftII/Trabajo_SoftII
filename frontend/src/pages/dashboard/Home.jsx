import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import RadialQuickChat from "../../components/RadialQuickChat";
import SubmenuGrid from "../../components/SubmenuGrid";
import SearchBar from "../../components/SearchBar";
import { useRadialWindow } from "../../hooks/useRadialWindow";
import { API_BASE } from "../../api/config";
import useLogin from "../../hooks/useLogin";
import "./Home.css";

export default function Home({ roomId: propRoomId = null }) {
  const navigate = useNavigate();
  const { user, logout } = useLogin();

  // --- SOCKET & ROOM ---
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(propRoomId || "");
  const [joined, setJoined] = useState(false);

  // --- VISUAL STATES ---
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  const mode = (selectedCat || searchTerm) ? "docked" : "center";
  const { center, radii } = useRadialWindow(mode);
  
  const menuOuter = mode === "docked" ? Math.round(radii.outer * 0.75) : radii.outer;
  const menuInner = Math.round(menuOuter * 0.5);

  // --- SOCKET CONNECTION ---
  useEffect(() => {
    const newSocket = io(API_BASE);
    setSocket(newSocket);
    if (propRoomId) joinRoom(newSocket, propRoomId);
    return () => newSocket.close();
  }, [propRoomId]);

  const joinRoom = (socketInstance, code) => {
    if (!socketInstance || !code) return;
    socketInstance.emit('join_room', { room: code, user: user });
    setJoined(true);
  };

  const handleManualJoin = () => {
    if (!roomCode.trim()) return;
    joinRoom(socket, roomCode);
  };

  // --- ACTIONS ---
  const enviarPictograma = (nombrePictograma) => {
    if (!socket || !joined) return;
    const payload = JSON.stringify({
      type: 'PICTOGRAMA',
      content: nombrePictograma, 
      studentName: user?.nombre || 'Alumno',
      studentId: user?.id
    });
    socket.emit('send_message', { room: roomCode, message: payload });
  };

  const handleEmergency = () => {
    if (!socket || !joined) return;
    const payload = JSON.stringify({
      type: 'EMERGENCIA',
      content: '¡Necesito ayuda urgente!',
      studentName: user?.nombre || 'Alumno'
    });
    socket.emit('send_message', { room: roomCode, message: payload });
    alert("¡Alerta enviada al profesor!");
  };

  const handleLogout = () => {
    logout();
    navigate('/login/alumno');
  };

  // --- HANDLERS UI ---
  const handleItemSelect = (cat) => setSelectedCat(cat);
  const handleSearch = (term) => { setSearchTerm(term); setSelectedCat(null); };
  const handleUndock = () => { setSelectedCat(null); setSearchTerm(null); };
  const handlePickSubItem = (val) => enviarPictograma(val);
  const handleCenterClick = () => console.log("Center Clicked");


  // === VISTA 1: PANTALLA DE INGRESO (Sin cambios) ===
  if (!joined && !propRoomId) {
    return (
      <div className="kahoot-layout">
        <button className="btn-icon-logout" onClick={handleLogout} title="Cerrar Sesión">✕</button>
        <main className="kahoot-center">
          <div className="student-avatar-large">
            {user?.nombre?.charAt(0).toUpperCase() || "A"}
          </div>
          <h1 className="welcome-student-title">Hola, {user?.nombre || 'Alumno'}</h1>
          <div className="kahoot-card join-card">
            <p className="join-instruction">Ingresa el PIN de juego o Código de clase</p>
            <input 
                type="text" 
                className="kahoot-input-field code-input"
                placeholder="Código" 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={10}
            />
            <button className="kahoot-btn-action btn-join" onClick={handleManualJoin}>Entrar</button>
          </div>
        </main>
        <div className="shape shape-circle"></div>
        <div className="shape shape-square"></div>
      </div>
    );
  }

  // === VISTA 2: INTERFAZ DE COMUNICACIÓN (Corregida) ===
  return (
    <div className="kahoot-layout active-room-layout">
      
      {/* 1. HEADER (Arriba) */}
      <header className="active-header">
        <div className="room-badge">
          <span>PIN: <strong>{roomCode}</strong></span>
        </div>
        <div className="user-badge-small">
          <span className="avatar-circle">{user?.nombre?.charAt(0) || "A"}</span>
          <span className="username-text">{user?.nombre}</span>
        </div>
        <button className="btn-mini-logout" onClick={handleLogout}>Salir</button>
      </header>

      {/* 2. ÁREA CENTRAL (Menú Radial Centrado) */}
      <div className="radial-wrapper">
        {mode === "center" && (
          <RadialQuickChat
            centerX={center.x}
            centerY={center.y}
            innerRadius={menuInner}
            outerRadius={menuOuter}
            onItem={handleItemSelect}
            onCenter={handleCenterClick}
          />
        )}

        {/* Grid de Resultados (Se sobrepone si buscas) */}
        {mode === "docked" && (
          <SubmenuGrid
            anchor="center"
            title={selectedCat || `Resultados: ${searchTerm}`}
            remoteTerm={searchTerm || selectedCat}
            lang="es"
            onPick={handlePickSubItem}
            onClose={handleUndock}
          />
        )}
      </div>

      {/* 3. BARRA DE BÚSQUEDA (Abajo Centro - FIJA) */}
      <div className="bottom-search-dock">
         <SearchBar onSearch={handleSearch} style={{ width: '100%' }} />
      </div>

      {/* 4. BOTÓN SOS (Abajo Derecha - FIJO) */}
      <button className="emergency-fab" onClick={handleEmergency}>
        🚨 SOS
      </button>

    </div>
  );
}