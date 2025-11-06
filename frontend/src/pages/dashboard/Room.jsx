// rebuild-trigger: touch to force CRA to recompile
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useRef } from 'react';

const SOCKET_SERVER = 'http://localhost:3001';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

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

    // Listen for user joined notifications
    const onUserJoined = (data) => {
      setMessages((prev) => [...prev, { system: true, message: data.message }]);
    };
    socketInstance.on('user_joined', onUserJoined);

    // Listen for user left notifications
    const onUserLeft = (data) => {
      setMessages((prev) => [...prev, { system: true, message: data.message }]);
    };
    socketInstance.on('user_left', onUserLeft);

    // auto-join when connected (emit will be buffered but do it on connect to be explicit)
    socketInstance.on('connect', () => {
      socketInstance.emit('join_room', roomId);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.off('receive_message', onReceive);
      socketInstance.off('user_joined', onUserJoined);
      socketInstance.off('user_left', onUserLeft);
      socketInstance.emit('leave_room', roomId);
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
      socket.emit('leave_room', roomId);
      navigate('/');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Room: {roomId}</h3>
          <button 
            className="btn btn-danger" 
            onClick={leaveRoom}
          >
            Leave Room
          </button>
        </div>
        <div className="card-body">
          <div 
            className="messages-container" 
            style={{ 
              height: '400px', 
              overflowY: 'auto',
              marginBottom: '20px'
            }}
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message ${msg.system ? 'text-muted' : ''}`}
                style={{ marginBottom: '10px' }}
              >
                {msg.system ? (
                  <em>{msg.message}</em>
                ) : (
                  <>
                    <strong>{msg.userId.slice(0, 6)}: </strong>
                    {msg.message}
                    <small className="text-muted ms-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </small>
                  </>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="input-group">
            <input
              type="text"
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}