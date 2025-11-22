// rebuild-trigger: touch to force CRA to recompile
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import useLogin from '../../hooks/useLogin';
import Vista_profe from './Vista_profe';
import Home from './Home';

const SOCKET_SERVER = 'http://localhost:3001';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useLogin();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState(new Set());

  useEffect(() => {
    // Connect to socket server
    const socketInstance = io(SOCKET_SERVER, { autoConnect: true });
    setSocket(socketInstance);

    // debug
    socketInstance.on('connect', () => {
      console.log('socket connected', socketInstance.id);
    });
    socketInstance.on('connect_error', (err) => console.error('connect_error', err));

    // Listen for messages
    const onReceive = (data) => {
      console.log('receive_message', data);
      setMessages((prev) => [...prev, data]);
    };
    socketInstance.on('receive_message', onReceive);

    // Listen for user joined notifications (expecting { userId, role, message } ideally)
    const onUserJoined = (data) => {
      try {
        if (data && data.userId) {
          setParticipants((prev) => new Set(prev).add(data.userId));
        }
      } catch (e) {}
      setMessages((prev) => [...prev, { system: true, message: data.message || 'Usuario se unió' }]);
    };
    socketInstance.on('user_joined', onUserJoined);

    // Listen for user left notifications
    const onUserLeft = (data) => {
      try {
        if (data && data.userId) {
          setParticipants((prev) => {
            const next = new Set(prev);
            next.delete(data.userId);
            return next;
          });
        }
      } catch (e) {}
      setMessages((prev) => [...prev, { system: true, message: data.message || 'Usuario salió' }]);
    };
    socketInstance.on('user_left', onUserLeft);

    // auto-join when connected (emit will be buffered but do it on connect to be explicit)
    socketInstance.on('connect', () => {
      // Inform server of join and include role if available
      const payload = { room: roomId };
      if (user) payload.user = { usuario: user.usuario, role: (user.tipo||user.role||'').toString().toUpperCase() };
      socketInstance.emit('join_room', payload);
      // optimistic local participant add
      try { setParticipants((prev) => new Set(prev).add(socketInstance.id)); } catch (e) {}
    });

    // Cleanup on unmount
    return () => {
      socketInstance.off('receive_message', onReceive);
      socketInstance.off('user_joined', onUserJoined);
      socketInstance.off('user_left', onUserLeft);
      socketInstance.emit('leave_room', { room: roomId });
      socketInstance.disconnect();
    };
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const payload = { room: roomId, message: message.trim() };
      socket.emit('send_message', payload);
      // optimistically add
      setMessages((prev) => [...prev, { userId: socket.id, message: payload.message, timestamp: new Date() }]);
      setMessage('');
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leave_room', { room: roomId });
      navigate('/');
    }
  };

  const role = (user && (user.tipo || user.role || '').toString().toUpperCase()) || null;

  // Render role-specific perspectives
  return (
    <div className="container mt-4">
      <div className="card">
        {role === 'PROFESOR' ? (
          // render the professor page (Vista_profe) inside the room and pass student count + roomId
          <div>
            <Vista_profe Nombre_clase={roomId} studentCount={participants ? participants.size : 0} socket={socket} />
          </div>
        ) : role === 'ALUMNO' ? (
          // render the alumno page (Home) inside the room and pass roomId so the UI can show joined context
          <div>
            <Home roomId={roomId} socket={socket} />
          </div>
        ) : (
          <div className="card-body">
            <p>No autenticado o rol desconocido. Por favor inicia sesión como Alumno o Profesor.</p>
            <div className="d-flex">
              <button className="btn btn-primary me-2" onClick={() => navigate('/login/alumno')}>Login Alumno</button>
              <button className="btn btn-secondary" onClick={() => navigate('/login/profesor')}>Login Profesor</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}