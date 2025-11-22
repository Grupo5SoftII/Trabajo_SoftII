import express, { Request, Response } from "express";
import cors from "cors";
import 'dotenv/config';

import morgan from "morgan";
import { createServer } from "http";
import { SocketServer } from "./socket.js";
import {
  PostgresAulaRepo,
  PostgresChatRepo,
  PostgresMensajePictogramaRepo,
  PostgresPictogramaRepo,
  PostgresUsuarioAulaRepo,
  PostgresUsuarioRepo
} from "./infra/PostgresRepositories.js";
import { pool } from "./infra/PostgresClient.js";
import { PictotapFacade } from "./services/PictotapFacade.js";
import { initDb } from "./infra/initDb.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  await initDb();

  const facade = new PictotapFacade(
    new PostgresUsuarioRepo(),
    new PostgresAulaRepo(),
    new PostgresUsuarioAulaRepo(),
    new PostgresChatRepo(),
    new PostgresPictogramaRepo(),
    new PostgresMensajePictogramaRepo()
  );

  // Root info
  app.get("/", async (_req: Request, res: Response) => {
    res.json({
      name: "PICTOTAP API",
      status: "ok",
      routes: [
        "GET    /",
        "CRUD   /usuarios",
        "CRUD   /aulas",
        "CRUD   /chats",
        "CRUD   /pictogramas",
        "GET    /inscripciones",
        "POST   /aulas/:aulaId/usuarios/:usuarioId",
        "DELETE /aulas/:aulaId/usuarios/:usuarioId",
        "GET    /chats/:chatId/mensajes",
        "POST   /chats/:chatId/mensajes  { emisorId, pictogramaId }",
        "PUT    /chats/:chatId/mensajes/:mensajeId",
        "DELETE /chats/:chatId/mensajes/:mensajeId"
      ]
    });
  });
  
  // Login endpoint. Verifies username + contrasena and optionally enforces a role (profesor/alumno)
  app.post("/login", async (req: Request, res: Response) => {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) return res.status(400).json({ ok: false, error: "Username y password requeridos" });

      const q = `SELECT id, nombre, apellidos, edad, tipo, usuario FROM usuarios WHERE usuario = $1 AND contrasena = $2 LIMIT 1`;
      const { rows } = await pool.query(q, [username, password]);
      const user = rows[0];
      if (!user) return res.status(401).json({ ok: false, error: "Credenciales invalidas" });

      if (role) {
        if ((user.tipo || '').toUpperCase() !== String(role).toUpperCase()) {
          return res.status(403).json({ ok: false, error: `Acceso solo para ${role}` });
        }
      }

      // devolver usuario (sin contrasena)
      return res.json({ ok: true, user });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Inscripciones
  app.get("/inscripciones", async (_req: Request, res: Response) => {
    try {
      res.json(await facade.listarInscripciones());
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Aulas <-> Usuarios
  app.post("/aulas/:aulaId/usuarios/:usuarioId", async (req: Request, res: Response) => {
    const aulaId = Number(req.params.aulaId);
    const usuarioId = Number(req.params.usuarioId);
    try {
      await facade.asignarUsuarioAAula(usuarioId, aulaId);
      res.status(200).json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.delete("/aulas/:aulaId/usuarios/:usuarioId", async (req: Request, res: Response) => {
    const aulaId = Number(req.params.aulaId);
    const usuarioId = Number(req.params.usuarioId);
    try {
      await facade.desasignarUsuarioAAula(usuarioId, aulaId);
      res.status(200).json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  // Usuarios CRUD
  app.get("/usuarios", async (_req: Request, res: Response) => {
    res.json(await facade.listarUsuarios());
  });

  app.get("/usuarios/:id", async (req: Request, res: Response) => {
    try {
      res.json(await facade.obtenerUsuario(Number(req.params.id)));
    } catch (e: any) {
      res.status(404).json({ ok: false, error: e.message });
    }
  });

  app.post("/usuarios", async (req: Request, res: Response) => {
    try {
      const payload = { ...req.body, edad: Number(req.body.edad) };
      const nuevo = await facade.crearUsuario(payload);
      res.status(201).json(nuevo);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.put("/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const body = { ...req.body };
      if (body.edad !== undefined) body.edad = Number(body.edad);
      const actualizado = await facade.actualizarUsuario(Number(req.params.id), body);
      res.json(actualizado);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.delete("/usuarios/:id", async (req: Request, res: Response) => {
    try {
      await facade.eliminarUsuario(Number(req.params.id));
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  // Aulas CRUD
  app.get("/aulas", async (_req: Request, res: Response) => {
    res.json(await facade.listarAulas());
  });

  app.get("/aulas/:id", async (req: Request, res: Response) => {
    try {
      res.json(await facade.obtenerAula(Number(req.params.id)));
    } catch (e: any) {
      res.status(404).json({ ok: false, error: e.message });
    }
  });

  app.post("/aulas", async (req: Request, res: Response) => {
    try {
      const payload = { ...req.body, profesorEncargado: Number(req.body.profesorEncargado) };
      const nuevo = await facade.crearAula(payload);
      res.status(201).json(nuevo);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.put("/aulas/:id", async (req: Request, res: Response) => {
    try {
      const body = { ...req.body };
      if (body.profesorEncargado !== undefined) {
        body.profesorEncargado = Number(body.profesorEncargado);
      }
      const actualizado = await facade.actualizarAula(Number(req.params.id), body);
      res.json(actualizado);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.delete("/aulas/:id", async (req: Request, res: Response) => {
    try {
      await facade.eliminarAula(Number(req.params.id));
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  // Chats CRUD
  app.get("/chats", async (_req: Request, res: Response) => {
    res.json(await facade.listarChats());
  });

  app.get("/chats/:id", async (req: Request, res: Response) => {
    try {
      res.json(await facade.obtenerChat(Number(req.params.id)));
    } catch (e: any) {
      res.status(404).json({ ok: false, error: e.message });
    }
  });

  app.post("/chats", async (req: Request, res: Response) => {
    try {
      const payload = { ...req.body, aulaId: Number(req.body.aulaId) };
      const nuevo = await facade.crearChat(payload);
      res.status(201).json(nuevo);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.put("/chats/:id", async (req: Request, res: Response) => {
    try {
      const body = { ...req.body };
      if (body.aulaId !== undefined) body.aulaId = Number(body.aulaId);
      const actualizado = await facade.actualizarChat(Number(req.params.id), body);
      res.json(actualizado);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.delete("/chats/:id", async (req: Request, res: Response) => {
    try {
      await facade.eliminarChat(Number(req.params.id));
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  // Pictogramas CRUD
  app.get("/pictogramas", async (_req: Request, res: Response) => {
    const list = await facade.listarPictogramas();
    res.json(list);
  });

  app.get("/pictogramas/:id", async (req: Request, res: Response) => {
    try {
      res.json(await facade.obtenerPictograma(Number(req.params.id)));
    } catch (e: any) {
      res.status(404).json({ ok: false, error: e.message });
    }
  });

  app.post("/pictogramas", async (req: Request, res: Response) => {
    try {
      const nuevo = await facade.crearPictograma(req.body);
      res.status(201).json(nuevo);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.put("/pictogramas/:id", async (req: Request, res: Response) => {
    try {
      const actualizado = await facade.actualizarPictograma(Number(req.params.id), req.body);
      res.json(actualizado);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.delete("/pictogramas/:id", async (req: Request, res: Response) => {
    try {
      await facade.eliminarPictograma(Number(req.params.id));
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  // Chats -> Mensajes
  app.post("/chats/:chatId/mensajes", async (req: Request, res: Response) => {
    const chatId = Number(req.params.chatId);
    const emisorId = Number(req.body.emisorId);
    const pictogramaId = Number(req.body.pictogramaId);
    try {
      const msg = await facade.enviarPictograma(chatId, emisorId, pictogramaId);
      res.status(200).json(msg);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.get("/chats/:chatId/mensajes", async (req: Request, res: Response) => {
    const chatId = Number(req.params.chatId);
    try {
      const list = await facade.listarMensajes(chatId);
      res.json(list);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.put("/chats/:chatId/mensajes/:mensajeId", async (req: Request, res: Response) => {
    const chatId = Number(req.params.chatId);
    const mensajeId = Number(req.params.mensajeId);
    try {
      const body = { ...req.body };
      if (body.emisorId !== undefined) body.emisorId = Number(body.emisorId);
      if (body.pictogramaId !== undefined) body.pictogramaId = Number(body.pictogramaId);
      const actualizado = await facade.actualizarMensaje(chatId, mensajeId, body);
      res.json(actualizado);
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.delete("/chats/:chatId/mensajes/:mensajeId", async (req: Request, res: Response) => {
    const chatId = Number(req.params.chatId);
    const mensajeId = Number(req.params.mensajeId);
    try {
      const removed = await facade.eliminarMensaje(chatId, mensajeId);
      res.json({ ok: true, removed });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  const httpServer = createServer(app);
  // Initialize socket server
  new SocketServer(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`PICTOTAP API listening on http://localhost:${PORT}`);
    console.log("Socket.IO server is ready");
  });
}

bootstrap().catch(err => {
  console.error("Error iniciando el servidor", err);
  process.exit(1);
});
