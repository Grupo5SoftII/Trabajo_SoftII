import { DatabaseSingleton } from "./DatabaseSingleton.js";
import { Usuario } from "../domain/Usuario.js";
import { Aula } from "../domain/Aula.js";
import { UsuarioAula } from "../domain/UsuarioAula.js";
import { Chat } from "../domain/Chat.js";
import { Pictograma } from "../domain/Pictograma.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";

export type PictogramaInput = Omit<Pictograma, "id"> & { id?: number };

// Interfaces (DIP ligero)
export interface UsuarioRepo {
  listAll(): Promise<Usuario[]>;
  getById(id: number): Promise<Usuario | undefined>;
  add(data: Omit<Usuario, "id">): Promise<Usuario>;
  update(id: number, data: Partial<Omit<Usuario, "id">>): Promise<Usuario | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface AulaRepo {
  listAll(): Promise<Aula[]>;
  getById(id: number): Promise<Aula | undefined>;
  add(data: Omit<Aula, "id">): Promise<Aula>;
  update(id: number, data: Partial<Omit<Aula, "id">>): Promise<Aula | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface UsuarioAulaRepo {
  listAll(): Promise<UsuarioAula[]>;
  add(usuarioId: number, aulaId: number): Promise<UsuarioAula>;
  findByUsuarioAndAula(usuarioId: number, aulaId: number): Promise<UsuarioAula | undefined>;
  remove(usuarioId: number, aulaId: number): Promise<boolean>;
  removeByUsuario(usuarioId: number): Promise<number>;
  removeByAula(aulaId: number): Promise<number>;
}

export interface ChatRepo {
  listAll(): Promise<Chat[]>;
  getById(id: number): Promise<Chat | undefined>;
  getByAulaId(aulaId: number): Promise<Chat | undefined>;
  add(data: Omit<Chat, "id">): Promise<Chat>;
  update(id: number, data: Partial<Omit<Chat, "id">>): Promise<Chat | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface PictogramaRepo {
  listAll(): Promise<Pictograma[]>;
  getById(id: number): Promise<Pictograma | undefined>;
  add(data: PictogramaInput): Promise<Pictograma>;
  update(id: number, data: Partial<Omit<Pictograma, "id">>): Promise<Pictograma | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface MensajePictogramaRepo {
  add(emisorId: number, chatId: number, pictogramaId: number): Promise<MensajePictograma>;
  listByChat(chatId: number): Promise<MensajePictograma[]>;
  getById(id: number): Promise<MensajePictograma | undefined>;
  update(id: number, data: Partial<Pick<MensajePictograma, "emisorId" | "pictogramaId">>): Promise<MensajePictograma | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByChat(chatId: number): Promise<number>;
  deleteByEmisor(emisorId: number): Promise<number>;
  deleteByPictograma(pictogramaId: number): Promise<number>;
}

// Implementaciones InMemory usando el Singleton
export class InMemoryUsuarioRepo implements UsuarioRepo {
  constructor(private db: DatabaseSingleton) {}
  async listAll() { return [...this.db.usuarios]; }
  async getById(id: number) { return this.db.usuarios.find(u => u.id === id); }
  async add(data: Omit<Usuario, "id">) {
    const id = this.db.nextId(this.db.usuarios);
    const usuario = new Usuario(id, data.nombre, data.apellidos, data.edad, data.tipo, data.usuario, data.contrasena);
    this.db.usuarios.push(usuario);
    return usuario;
  }
  async update(id: number, data: Partial<Omit<Usuario, "id">>) {
    const usuario = await this.getById(id);
    if (!usuario) return undefined;
    if (data.nombre !== undefined) usuario.nombre = data.nombre;
    if (data.edad !== undefined) usuario.edad = data.edad;
    if (data.tipo !== undefined) usuario.tipo = data.tipo;
    return usuario;
  }
  async delete(id: number) {
    const idx = this.db.usuarios.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.db.usuarios.splice(idx, 1);
    return true;
  }
}

export class InMemoryAulaRepo implements AulaRepo {
  constructor(private db: DatabaseSingleton) {}
  async listAll() { return [...this.db.aulas]; }
  async getById(id: number) { return this.db.aulas.find(a => a.id === id); }
  async add(data: Omit<Aula, "id">) {
    const id = this.db.nextId(this.db.aulas);
    const aula = new Aula(id, data.nombre, data.grado, data.profesorEncargado);
    this.db.aulas.push(aula);
    return aula;
  }
  async update(id: number, data: Partial<Omit<Aula, "id">>) {
    const aula = await this.getById(id);
    if (!aula) return undefined;
    if (data.nombre !== undefined) aula.nombre = data.nombre;
    if (data.grado !== undefined) aula.grado = data.grado;
    if (data.profesorEncargado !== undefined) aula.profesorEncargado = data.profesorEncargado;
    return aula;
  }
  async delete(id: number) {
    const idx = this.db.aulas.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.db.aulas.splice(idx, 1);
    return true;
  }
}

export class InMemoryUsuarioAulaRepo implements UsuarioAulaRepo {
  constructor(private db: DatabaseSingleton) {}
  async listAll() { return [...this.db.usuarioAula]; }
  async add(usuarioId: number, aulaId: number) {
    const id = this.db.nextId(this.db.usuarioAula);
    const ua = new UsuarioAula(id, usuarioId, aulaId);
    this.db.usuarioAula.push(ua);
    return ua;
  }
  async findByUsuarioAndAula(usuarioId: number, aulaId: number) {
    return this.db.usuarioAula.find(x => x.usuarioId === usuarioId && x.aulaId === aulaId);
  }
  async remove(usuarioId: number, aulaId: number) {
    const idx = this.db.usuarioAula.findIndex(x => x.usuarioId === usuarioId && x.aulaId === aulaId);
    if (idx === -1) return false;
    this.db.usuarioAula.splice(idx, 1);
    return true;
  }
  async removeByUsuario(usuarioId: number) {
    const before = this.db.usuarioAula.length;
    this.db.usuarioAula = this.db.usuarioAula.filter(x => x.usuarioId !== usuarioId);
    return before - this.db.usuarioAula.length;
  }
  async removeByAula(aulaId: number) {
    const before = this.db.usuarioAula.length;
    this.db.usuarioAula = this.db.usuarioAula.filter(x => x.aulaId !== aulaId);
    return before - this.db.usuarioAula.length;
  }
}

export class InMemoryChatRepo implements ChatRepo {
  constructor(private db: DatabaseSingleton) {}
  async listAll() { return [...this.db.chats]; }
  async getById(id: number) { return this.db.chats.find(c => c.id === id); }
  async getByAulaId(aulaId: number) { return this.db.chats.find(c => c.aulaId === aulaId); }
  async add(data: Omit<Chat, "id">) {
    const id = this.db.nextId(this.db.chats);
    const chat = new Chat(id, data.tipo, data.aulaId);
    this.db.chats.push(chat);
    return chat;
  }
  async update(id: number, data: Partial<Omit<Chat, "id">>) {
    const chat = await this.getById(id);
    if (!chat) return undefined;
    if (data.tipo !== undefined) chat.tipo = data.tipo;
    if (data.aulaId !== undefined) chat.aulaId = data.aulaId;
    return chat;
  }
  async delete(id: number) {
    const idx = this.db.chats.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.db.chats.splice(idx, 1);
    return true;
  }
}

export class InMemoryPictogramaRepo implements PictogramaRepo {
  constructor(private db: DatabaseSingleton) {}
  async listAll() { return [...this.db.pictogramas]; }
  async getById(id: number) { return this.db.pictogramas.find(p => p.id === id); }
  async add(data: PictogramaInput) {
    const id = data.id ?? this.db.nextId(this.db.pictogramas);
    const pic = new Pictograma(id, data.url, data.titulo);
    this.db.pictogramas.push(pic);
    return pic;
  }
  async update(id: number, data: Partial<Omit<Pictograma, "id">>) {
    const pic = await this.getById(id);
    if (!pic) return undefined;
    if (data.url !== undefined) pic.url = data.url;
    if (data.titulo !== undefined) pic.titulo = data.titulo;
    return pic;
  }
  async delete(id: number) {
    const idx = this.db.pictogramas.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.db.pictogramas.splice(idx, 1);
    return true;
  }
}

export class InMemoryMensajePictogramaRepo implements MensajePictogramaRepo {
  constructor(private db: DatabaseSingleton) {}
  async add(emisorId: number, chatId: number, pictogramaId: number) {
    const id = this.db.nextId(this.db.mensajes);
    const m = new MensajePictograma(id, new Date(), emisorId, chatId, pictogramaId);
    this.db.mensajes.push(m);
    return m;
  }
  async listByChat(chatId: number) {
    return this.db.mensajes.filter(m => m.chatId === chatId);
  }
  async getById(id: number) { return this.db.mensajes.find(m => m.id === id); }
  async update(id: number, data: Partial<Pick<MensajePictograma, "emisorId" | "pictogramaId">>) {
    const msg = await this.getById(id);
    if (!msg) return undefined;
    if (data.emisorId !== undefined) msg.emisorId = data.emisorId;
    if (data.pictogramaId !== undefined) msg.pictogramaId = data.pictogramaId;
    return msg;
  }
  async delete(id: number) {
    const idx = this.db.mensajes.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.db.mensajes.splice(idx, 1);
    return true;
  }
  async deleteByChat(chatId: number) {
    const before = this.db.mensajes.length;
    this.db.mensajes = this.db.mensajes.filter(m => m.chatId !== chatId);
    return before - this.db.mensajes.length;
  }
  async deleteByEmisor(emisorId: number) {
    const before = this.db.mensajes.length;
    this.db.mensajes = this.db.mensajes.filter(m => m.emisorId !== emisorId);
    return before - this.db.mensajes.length;
  }
  async deleteByPictograma(pictogramaId: number) {
    const before = this.db.mensajes.length;
    this.db.mensajes = this.db.mensajes.filter(m => m.pictogramaId !== pictogramaId);
    return before - this.db.mensajes.length;
  }
}
