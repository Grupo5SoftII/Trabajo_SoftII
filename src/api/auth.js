// api/auth.js
const API_BASE = 'http://tu-backend.com'; // URL de tu backend

export async function loginUser({ username, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Login fallido');

  return await res.json(); // token, info del usuario, etc.
}
