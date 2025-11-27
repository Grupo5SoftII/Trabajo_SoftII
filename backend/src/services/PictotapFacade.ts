import {
  UsuarioRepo, AulaRepo, UsuarioAulaRepo, ChatRepo, PictogramaRepo, MensajePictogramaRepo, PictogramaInput
} from "../infra/Repositories.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";
import { Pictograma } from "../domain/Pictograma.js";
import { Usuario } from "../domain/Usuario.js";
import { Aula } from "../domain/Aula.js";
import { Chat } from "../domain/Chat.js";

type NuevoUsuario = Omit<Usuario, "id">; 
type NuevoChat = Omit<Chat, "id">;
type NuevoPictograma = PictogramaInput;

export class PictotapFacade {
  constructor(
    private usuarios: UsuarioRepo,
    private aulas: AulaRepo,
    private usuarioAula: UsuarioAulaRepo,
    private chats: ChatRepo,
    private pictos: PictogramaRepo,
    private mensajes: MensajePictogramaRepo
  ) {}

  // === Usuarios ===
  async listarUsuarios(): Promise<Usuario[]> { return this.usuarios.listAll(); }
  
  async obtenerUsuario(id: number): Promise<Usuario> {
    const u = await this.usuarios.getById(id);
    if (!u) throw new Error("Usuario no existe");
    return u;
  }

  async crearUsuario(data: any): Promise<Usuario> {
    if(!data.nombre || !data.contrasena) throw new Error("Datos incompletos");
    return this.usuarios.add({ 
        nombre: data.nombre,
        apellido: data.apellido || "", 
        edad: data.edad || 0,
        tipo: (data.tipo || 'ALUMNO').toUpperCase(),
        contrasena: data.contrasena
    });
  }
  
  async actualizarUsuario(id: number, data: any): Promise<Usuario> { throw new Error("No impl"); }
  
  async eliminarUsuario(id: number): Promise<void> {
    await this.obtenerUsuario(id);
    await this.usuarioAula.removeByUsuario(id);
    await this.mensajes.deleteByEmisor(id);
    await this.usuarios.delete(id);
  }

  // === Aulas ===
  async listarAulas(): Promise<Aula[]> { return this.aulas.listAll(); }
  
  async obtenerAula(id: number): Promise<Aula> {
    const a = await this.aulas.getById(id);
    if (!a) throw new Error("Aula no existe");
    return a;
  }

  async crearAula(data: any): Promise<Aula> {
    if (!data.materia) throw new Error("Materia obligatoria");
    const profesorId = data.profesorEncargado || data.profesorId;
    return this.aulas.add({
        materia: data.materia,
        grado: data.grado || "General",
        profesorId: profesorId
    });
  }
  
  async actualizarAula(id: number, data: any): Promise<Aula> { throw new Error("No impl"); }
  
  async eliminarAula(id: number): Promise<void> {
    const chats = await this.chats.getByAulaId(id);
    if(chats) {
        await this.mensajes.deleteByChat(chats.id);
        await this.chats.delete(chats.id);
    }
    await this.usuarioAula.removeByAula(id);
    await this.aulas.delete(id);
  }

  // === Usuario - Aula ===
  async asignarUsuarioAAula(usuarioId: number, aulaId: number): Promise<void> {
    await this.usuarioAula.add(usuarioId, aulaId);
  }
  
  async desasignarUsuarioAAula(usuarioId: number, aulaId: number): Promise<void> {
    await this.usuarioAula.remove(usuarioId, aulaId);
  }
  
  listarInscripciones() { return this.usuarioAula.listAll(); }

  // === Chats ===
  async listarChats(): Promise<Chat[]> { return this.chats.listAll(); }
  async obtenerChat(id: number): Promise<Chat> { 
      const c = await this.chats.getById(id); 
      if(!c) throw new Error("Chat no existe"); return c; 
  }
  async crearChat(data: NuevoChat): Promise<Chat> { return this.chats.add(data); }
  async actualizarChat(id: number, data: any): Promise<Chat> { throw new Error("No impl"); }
  async eliminarChat(id: number): Promise<void> { 
      await this.mensajes.deleteByChat(id);
      await this.chats.delete(id);
  }

  // === Pictogramas ===
  async listarPictogramas(): Promise<Pictograma[]> { return this.pictos.listAll(); }
  async obtenerPictograma(id: number): Promise<Pictograma> {
    const p = await this.pictos.getById(id);
    if(!p) throw new Error("No existe"); return p;
  }
  
  async crearPictograma(data: NuevoPictograma): Promise<Pictograma> {
    if (!data.nombre?.trim()) throw new Error("Nombre obligatorio");
    // YA NO VALIDAMOS URL
    return this.pictos.add(data);
  }
  
  async actualizarPictograma(id: number, data: any): Promise<Pictograma> { throw new Error("No impl"); }
  
  async eliminarPictograma(id: number): Promise<void> {
      await this.mensajes.deleteByPictograma(id);
      await this.pictos.delete(id);
  }

  // === Mensajes ===
  async enviarPictograma(chatId: number, emisorId: number, pictogramaId: number): Promise<MensajePictograma> {
    return this.mensajes.add(emisorId, chatId, pictogramaId);
  }
  
  async listarMensajes(chatId: number): Promise<MensajePictograma[]> {
    return this.mensajes.listByChat(chatId);
  }
  
  async actualizarMensaje(chatId: number, mensajeId: number, data: any) { throw new Error("No impl"); }
  
  async eliminarMensaje(chatId: number, mensajeId: number) {
     await this.mensajes.delete(mensajeId);
  }
}