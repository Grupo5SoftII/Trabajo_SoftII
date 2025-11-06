import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { SocketServer } from './socket.js';

import { DatabaseSingleton } from './infra/DatabaseSingleton.js';
import {
  InMemoryUsuarioRepo, InMemoryAulaRepo, InMemoryUsuarioAulaRepo,
  InMemoryChatRepo, InMemoryPictogramaRepo, InMemoryMensajePictogramaRepo
} from './infra/Repositories.js';
import { PictotapFacade } from './services/PictotapFacade.js';
import { Aula } from './domain/Aula.js';
import { Usuario } from './domain/Usuario.js';
import { Chat } from './domain/Chat.js';
import { Pictograma } from './domain/Pictograma.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// DB + seed
const db = DatabaseSingleton.getInstance();
if (db.usuarios.length === 0) {
  db.usuarios.push(new Usuario(1, 'Profe Ana', 34, 'PROFESOR'));
  db.usuarios.push(new Usuario(2, 'Luis', 8, 'ALUMNO'));
  db.usuarios.push(new Usuario(3, 'Mía', 9, 'ALUMNO'));
  db.aulas.push(new Aula(10, '1ro Primaria A', '1ro', 1));
  db.chats.push(new Chat(100, 'AULA', 10));
  db.pictogramas.push(new Pictograma(1000, 'https://picsum.photos/seed/saludo/64', 'HOLA'));
  db.pictogramas.push(new Pictograma(1001, 'https://picsum.photos/seed/baño/64', 'BAÑO'));
  db.pictogramas.push(new Pictograma(1002, 'https://picsum.photos/seed/agua/64', 'AGUA'));
}

// repos + facade
const facade = new PictotapFacade(
  new InMemoryUsuarioRepo(db),
  new InMemoryAulaRepo(db),
  new InMemoryUsuarioAulaRepo(db),
  new InMemoryChatRepo(db),
  new InMemoryPictogramaRepo(db),
  new InMemoryMensajePictogramaRepo(db)
);

// Routes
// Root info
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'PICTOTAP API',
    status: 'ok',
    routes: [
      'GET    /',
      'GET    /pictogramas',
      'GET    /usuarios',
      'GET    /aulas',
      'GET    /chats',
      'GET    /inscripciones',
      'POST   /aulas/:aulaId/usuarios/:usuarioId',
      'GET    /chats/:chatId/mensajes',
      'POST   /chats/:chatId/mensajes  { emisorId, pictogramaId }',
      'DELETE /chats/:chatId/mensajes/:mensajeId'
    ]
  });
});

// Inspección de estado (listas)
app.get('/usuarios', (_req: Request, res: Response) => res.json(db.usuarios));
app.get('/aulas',   (_req: Request, res: Response) => res.json(db.aulas));
app.get('/chats',   (_req: Request, res: Response) => res.json(db.chats));
app.get('/inscripciones', (_req: Request, res: Response) => res.json(db.usuarioAula));
// Pictogramas
app.get('/pictogramas', (_req: Request, res: Response) => {
  const list = facade.listarPictogramas();
  res.json(list);
});

// Aulas
app.post('/aulas/:aulaId/usuarios/:usuarioId', (req: Request, res: Response) => {
  const aulaId = Number(req.params.aulaId);
  const usuarioId = Number(req.params.usuarioId);
  try {
    facade.asignarUsuarioAAula(usuarioId, aulaId);
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Chats
app.post('/chats/:chatId/mensajes', (req: Request, res: Response) => {
  const chatId = Number(req.params.chatId);
  const { emisorId, pictogramaId } = req.body as { emisorId: number; pictogramaId: number };
  try {
    const msg = facade.enviarPictograma(chatId, emisorId, pictogramaId);
    res.status(200).json(msg);
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get('/chats/:chatId/mensajes', (req: Request, res: Response) => {
  const chatId = Number(req.params.chatId);
  const list = facade.listarMensajes(chatId);
  res.json(list);
});

// Extra: borrar mensaje por id (in-memory)
app.delete('/chats/:chatId/mensajes/:mensajeId', (req: Request, res: Response) => {
  const mensajeId = Number(req.params.mensajeId);
  const idx = db.mensajes.findIndex(m => m.id === mensajeId);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'Mensaje no encontrado' });
  const [removed] = db.mensajes.splice(idx, 1);
  res.json({ ok: true, removed });
});

const PORT = process.env.PORT || 3001;

// Create HTTP server
const httpServer = createServer(app);

// Initialize socket server
const socketServer = new SocketServer(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`PICTOTAP API listening on http://localhost:${PORT}`);
  console.log('Socket.IO server is ready');
});
