import { Usuario } from "../domain/Usuario.js";
import { Aula } from "../domain/Aula.js";
import { UsuarioAula } from "../domain/UsuarioAula.js";
import { Chat } from "../domain/Chat.js";
import { Pictograma } from "../domain/Pictograma.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";

export type PictogramaInput = { nombre: string };

export interface UsuarioRepo {
  listAll(): Promise<Usuario[]>;
  getById(id: number): Promise<Usuario | undefined>;
  add(data: Omit<Usuario, "id">): Promise<Usuario>;
  update(id: number, data: any): Promise<Usuario | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface AulaRepo {
  listAll(): Promise<Aula[]>;
  getById(id: number): Promise<Aula | undefined>;
  // Codigo opcional porque lo generamos nosotros si falta
  add(data: { materia: string; grado: string; profesorId: number; codigo?: number }): Promise<Aula>;
  update(id: number, data: any): Promise<Aula | undefined>;
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
  update(id: number, data: any): Promise<Chat | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface PictogramaRepo {
  listAll(): Promise<Pictograma[]>;
  getById(id: number): Promise<Pictograma | undefined>;
  add(data: PictogramaInput): Promise<Pictograma>;
  update(id: number, data: any): Promise<Pictograma | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface MensajePictogramaRepo {
  add(emisorId: number, chatId: number, pictogramaId: number): Promise<MensajePictograma>;
  listByChat(chatId: number): Promise<MensajePictograma[]>;
  getById(id: number): Promise<MensajePictograma | undefined>;
  update(id: number, data: any): Promise<MensajePictograma | undefined>;
  delete(id: number): Promise<boolean>;
  deleteByChat(chatId: number): Promise<number>;
  deleteByEmisor(emisorId: number): Promise<number>;
  deleteByPictograma(pictogramaId: number): Promise<number>;
}