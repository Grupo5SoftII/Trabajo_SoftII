import React from 'react';

export default function ChatPanel({ title, messages = [], onClose = () => {} }) {
  return (
    <>
      <div className="chat-header d-flex align-items-center px-3">
        <div className="chat-title">
          <strong>{title}</strong>
        </div>
        <button
          className="btn btn-light btn-sm ms-auto"
          style={{ borderRadius: '8px' }}
          onClick={onClose}
          aria-label="Cerrar chat"
        >
          Cerrar
        </button>
      </div>

      <div className="chat-body p-3">
        {(messages || []).map((m) => (
          <div key={m.id} className={`message mb-2 ${m.sender === 'teacher' ? 'teacher' : 'alumno'}`}>
            {m.type === 'img' ? (
              <img src={m.src} alt="pictograma" style={{ maxWidth: 160, borderRadius: 8 }} />
            ) : (
              m.content
            )}
          </div>
        ))}
      </div>
    </>
  );
}
