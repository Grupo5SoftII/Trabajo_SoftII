import React from 'react';
import useLogin from '../hooks/useLogin';
import './AuthBar.css';

export default function AuthBar() {
  const { user, logout } = useLogin();

  return (
    <div className="authbar">
      <div className="authbar-inner">
        <span className="auth-user">{user ? `${user.nombre} ${user.apellidos} (${user.usuario})` : 'No autenticado'}</span>
        {user && (
          <button className="auth-logout" onClick={() => logout()}>
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
}
