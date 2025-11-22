// api/auth.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export async function loginUser({ username, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload?.error || 'Login fallido';
    throw new Error(msg);
  }

  // El backend devuelve { ok: true, user }
  return payload.user || payload;
}
