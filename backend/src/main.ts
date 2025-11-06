import { DatabaseSingleton } from "./infra/DatabaseSingleton.js";
import {
  InMemoryUsuarioRepo, InMemoryAulaRepo, InMemoryUsuarioAulaRepo,
  InMemoryChatRepo, InMemoryPictogramaRepo, InMemoryMensajePictogramaRepo
} from "./infra/Repositories.js";
import { PictotapFacade } from "./services/PictotapFacade.js";
import { Aula } from "./domain/Aula.js";
import { Usuario } from "./domain/Usuario.js";
import { Chat } from "./domain/Chat.js";
import { Pictograma } from "./domain/Pictograma.js";
import { AulaController } from "./controllers/AulaController.js";
import { ChatController } from "./controllers/ChatController.js";
import { PictogramController } from "./controllers/PictogramController.js";

// 1) Singleton DB en memoria
const db = DatabaseSingleton.getInstance();

// 2) Seed mínimo (usuarios, aula, chat, pictogramas)
db.usuarios.push(new Usuario(1, "Profe Ana", 34, "PROFESOR"));
db.usuarios.push(new Usuario(2, "Luis", 8, "ALUMNO"));
db.usuarios.push(new Usuario(3, "Mía", 9, "ALUMNO"));

db.aulas.push(new Aula(10, "1ro Primaria A", "1ro", 1));
db.chats.push(new Chat(100, "AULA", 10));

db.pictogramas.push(new Pictograma(1000, "https://picsum.photos/seed/saludo/64", "HOLA"));
db.pictogramas.push(new Pictograma(1001, "https://picsum.photos/seed/baño/64", "BAÑO"));
db.pictogramas.push(new Pictograma(1002, "https://picsum.photos/seed/agua/64", "AGUA"));

// 3) Repos
const usuarioRepo = new InMemoryUsuarioRepo(db);
const aulaRepo = new InMemoryAulaRepo(db);
const usuarioAulaRepo = new InMemoryUsuarioAulaRepo(db);
const chatRepo = new InMemoryChatRepo(db);
const pictogramaRepo = new InMemoryPictogramaRepo(db);
const mensajeRepo = new InMemoryMensajePictogramaRepo(db);

// 4) Facade
const facade = new PictotapFacade(
  usuarioRepo, aulaRepo, usuarioAulaRepo, chatRepo, pictogramaRepo, mensajeRepo
);

// 5) Controllers “simulados” (solo prints)
const aulaCtl = new AulaController(facade);
const chatCtl = new ChatController(facade);
const pictCtl = new PictogramController(facade);

// —— DEMO DEL FLUJO (prints) —— //
console.log("=== PICTOTAP DEMO (prints) ===\n");

// A) Listar pictogramas
pictCtl.listarPictogramas();

// B) Asignar alumnos al aula
aulaCtl.asignarUsuarioAAula(2, 10);
aulaCtl.asignarUsuarioAAula(3, 10);
aulaCtl.asignarUsuarioAAula(2, 10); // repetido (no duplica)

// C) Enviar pictogramas al chat del aula
chatCtl.enviarPictograma(100, 2, 1000); // Luis: HOLA
chatCtl.enviarPictograma(100, 3, 1002); // Mía: AGUA
chatCtl.enviarPictograma(100, 2, 1001); // Luis: BAÑO

// D) Listar mensajes del chat
chatCtl.listarMensajes(100);

console.log("\n=== FIN DEMO ===");
