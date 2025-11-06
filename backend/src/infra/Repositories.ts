import { DatabaseSingleton } from "./DatabaseSingleton.js";
import { Usuario } from "../domain/Usuario.js";
import { Aula } from "../domain/Aula.js";
import { UsuarioAula } from "../domain/UsuarioAula.js";
import { Chat } from "../domain/Chat.js";
import { Pictograma } from "../domain/Pictograma.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";

// Interfaces (DIP ligero)
export interface UsuarioRepo {
  getById(id: number): Usuario | undefined;
}

export interface AulaRepo {
  getById(id: number): Aula | undefined;
}

export interface UsuarioAulaRepo {
  add(usuarioId: number, aulaId: number): UsuarioAula;
  findByUsuarioAndAula(usuarioId: number, aulaId: number): UsuarioAula | undefined;
}

export interface ChatRepo {
  getByAulaId(aulaId: number): Chat | undefined;
}

export interface PictogramaRepo {
  listAll(): Pictograma[];
  getById(id: number): Pictograma | undefined;
}

export interface MensajePictogramaRepo {
  add(emisorId: number, chatId: number, pictogramaId: number): MensajePictograma;
  listByChat(chatId: number): MensajePictograma[];
}

// Implementaciones InMemory usando el Singleton
export class InMemoryUsuarioRepo implements UsuarioRepo {
  constructor(private db: DatabaseSingleton) {}
  getById(id: number) { return this.db.usuarios.find(u => u.id === id); }
}

export class InMemoryAulaRepo implements AulaRepo {
  constructor(private db: DatabaseSingleton) {}
  getById(id: number) { return this.db.aulas.find(a => a.id === id); }
}

export class InMemoryUsuarioAulaRepo implements UsuarioAulaRepo {
  constructor(private db: DatabaseSingleton) {}
  add(usuarioId: number, aulaId: number) {
    const id = this.db.nextId(this.db.usuarioAula);
    const ua = new UsuarioAula(id, usuarioId, aulaId);
    this.db.usuarioAula.push(ua);
    return ua;
  }
  findByUsuarioAndAula(usuarioId: number, aulaId: number) {
    return this.db.usuarioAula.find(x => x.usuarioId === usuarioId && x.aulaId === aulaId);
  }
}

export class InMemoryChatRepo implements ChatRepo {
  constructor(private db: DatabaseSingleton) {}
  getByAulaId(aulaId: number) { return this.db.chats.find(c => c.aulaId === aulaId); }
}

export class InMemoryPictogramaRepo implements PictogramaRepo {
  constructor(private db: DatabaseSingleton) {}
  listAll() { return [...this.db.pictogramas]; }
  getById(id: number) { return this.db.pictogramas.find(p => p.id === id); }
}

export class InMemoryMensajePictogramaRepo implements MensajePictogramaRepo {
  constructor(private db: DatabaseSingleton) {}
  add(emisorId: number, chatId: number, pictogramaId: number) {
    const id = this.db.nextId(this.db.mensajes);
    const m = new MensajePictograma(id, new Date(), emisorId, chatId, pictogramaId);
    this.db.mensajes.push(m);
    return m;
  }
  listByChat(chatId: number) {
    return this.db.mensajes.filter(m => m.chatId === chatId);
  }
}
