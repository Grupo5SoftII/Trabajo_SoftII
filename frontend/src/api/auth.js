// src/api/auth.js
import { API_BASE } from './config';

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }

  return data.user; 
}