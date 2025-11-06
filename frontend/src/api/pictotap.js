// API client for pictotap backend

const API_BASE = 'http://localhost:3001';

// Pictogramas
export async function getPictogramas() {
  const res = await fetch(`${API_BASE}/pictogramas`);
  if (!res.ok) throw new Error('Error getting pictograms');
  return await res.json();
}

// Usuarios y Aulas
export async function getUsuarios() {
  const res = await fetch(`${API_BASE}/usuarios`);
  if (!res.ok) throw new Error('Error getting users');
  return await res.json();
}

export async function getAulas() {
  const res = await fetch(`${API_BASE}/aulas`);
  if (!res.ok) throw new Error('Error getting classrooms');
  return await res.json();
}

export async function asignarUsuarioAAula(aulaId, usuarioId) {
  const res = await fetch(`${API_BASE}/aulas/${aulaId}/usuarios/${usuarioId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Error assigning user to classroom');
  return await res.json();
}

// Chats y Mensajes
export async function getChatMensajes(chatId) {
  const res = await fetch(`${API_BASE}/chats/${chatId}/mensajes`);
  if (!res.ok) throw new Error('Error getting chat messages');
  return await res.json();
}

export async function enviarMensaje(chatId, emisorId, pictogramaId) {
  const res = await fetch(`${API_BASE}/chats/${chatId}/mensajes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emisorId, pictogramaId })
  });
  if (!res.ok) throw new Error('Error sending message');
  return await res.json();
}

export async function borrarMensaje(chatId, mensajeId) {
  const res = await fetch(`${API_BASE}/chats/${chatId}/mensajes/${mensajeId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error deleting message');
  return await res.json();
}