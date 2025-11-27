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

import pool from "./infra/db.js"; 

import { PictotapFacade } from "./services/PictotapFacade.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  
  const facade = new PictotapFacade(
    new PostgresUsuarioRepo(),
    new PostgresAulaRepo(),
    new PostgresUsuarioAulaRepo(),
    new PostgresChatRepo(),
    new PostgresPictogramaRepo(),
    new PostgresMensajePictogramaRepo()
  );

  app.get("/", async (_req: Request, res: Response) => {
    res.json({ name: "PICTOTAP API (Azure Connected)", status: "ok" });
  });
  
  app.post("/login", async (req: Request, res: Response) => {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) return res.status(400).json({ ok: false, error: "Username y password requeridos" });

      // Buscamos por nombre y contraseña.
      const q = `
        SELECT usuario_id as id, nombre, apellido, edad, tipo
        FROM Usuario 
        WHERE nombre = $1 AND contraseña = $2 
        LIMIT 1
      `;
      
      const { rows } = await pool.query(q, [username, password]);
      const user = rows[0];

      if (!user) return res.status(401).json({ ok: false, error: "Credenciales invalidas" });

      if (role) {
        if ((user.tipo || '').toUpperCase() !== String(role).toUpperCase()) {
          return res.status(403).json({ ok: false, error: `Acceso solo para ${role}` });
        }
      }

      return res.json({ ok: true, user });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // RUTAS DEL FACADE
  app.get("/inscripciones", async (_req, res) => res.json(await facade.listarInscripciones()));

  app.post("/aulas/:aulaId/usuarios/:usuarioId", async (req, res) => {
    try { await facade.asignarUsuarioAAula(Number(req.params.usuarioId), Number(req.params.aulaId)); res.json({ ok: true }); } 
    catch (e: any) { res.status(400).json({ ok: false, error: e.message }); }
  });

  app.delete("/aulas/:aulaId/usuarios/:usuarioId", async (req, res) => {
    try { await facade.desasignarUsuarioAAula(Number(req.params.usuarioId), Number(req.params.aulaId)); res.json({ ok: true }); } 
    catch (e: any) { res.status(400).json({ ok: false, error: e.message }); }
  });

  app.get("/usuarios", async (_req, res) => res.json(await facade.listarUsuarios()));
  app.get("/usuarios/:id", async (req, res) => res.json(await facade.obtenerUsuario(Number(req.params.id))));
  
  app.post("/usuarios", async (req, res) => {
    try {
        const nuevo = await facade.crearUsuario({ 
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            edad: Number(req.body.edad),
            tipo: req.body.tipo,
            contrasena: req.body.contrasena
        });
        res.status(201).json(nuevo); 
    } 
    catch (e: any) { res.status(400).json({ ok: false, error: e.message }); }
  });

  app.get("/aulas", async (_req, res) => res.json(await facade.listarAulas()));
  
  app.post("/aulas", async (req, res) => {
    try {
        const nuevo = await facade.crearAula({ 
            materia: req.body.materia,
            grado: req.body.grado,
            profesorId: Number(req.body.profesorEncargado || req.body.profesorId)
        });
        res.status(201).json(nuevo); 
    } 
    catch (e: any) { res.status(400).json({ ok: false, error: e.message }); }
  });

  app.get("/chats", async (_req, res) => res.json(await facade.listarChats()));
  
  app.get("/pictogramas", async (_req, res) => res.json(await facade.listarPictogramas()));
  
  app.post("/pictogramas", async (req, res) => {
      try {
          const nuevo = await facade.crearPictograma({ nombre: req.body.nombre });
          res.status(201).json(nuevo);
      } catch (e: any) { res.status(400).json({ ok: false, error: e.message }); }
  });

  app.post("/chats/:chatId/mensajes", async (req, res) => {
    try { 
      res.json(await facade.enviarPictograma(Number(req.params.chatId), Number(req.body.emisorId), Number(req.body.pictogramaId))); 
    } catch (e: any) { res.status(400).json({ ok: false, error: e.message }); }
  });

  app.get("/chats/:chatId/mensajes", async (req, res) => {
    try { res.json(await facade.listarMensajes(Number(req.params.chatId))); } 
    catch (e: any) { res.status(400).json({ ok: false, error: e.message }); }
  });

  const httpServer = createServer(app);
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