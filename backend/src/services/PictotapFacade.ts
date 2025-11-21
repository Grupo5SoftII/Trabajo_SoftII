import {
  UsuarioRepo,
  AulaRepo,
  UsuarioAulaRepo,
  ChatRepo,
  PictogramaRepo,
  MensajePictogramaRepo,
  PictogramaInput
} from "../infra/Repositories.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";
import { Pictograma } from "../domain/Pictograma.js";
import { Usuario } from "../domain/Usuario.js";
import { Aula } from "../domain/Aula.js";
import { Chat } from "../domain/Chat.js";

type NuevoUsuario = Omit<Usuario, "id">;
type NuevaAula = Omit<Aula, "id">;
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
  async listarUsuarios(): Promise<Usuario[]> {
    return this.usuarios.listAll();
  }

  async obtenerUsuario(id: number): Promise<Usuario> {
    const u = await this.usuarios.getById(id);
    if (!u) throw new Error("Usuario no existe");
    return u;
  }

  async crearUsuario(data: NuevoUsuario): Promise<Usuario> {
    this.validarUsuario(data);
    return this.usuarios.add({ ...data, tipo: data.tipo.toUpperCase() });
  }

  async actualizarUsuario(id: number, data: Partial<NuevoUsuario>): Promise<Usuario> {
    if (data.tipo) data.tipo = data.tipo.toUpperCase();
    const actual = await this.obtenerUsuario(id);
    this.validarUsuario({ ...actual, ...data });
    const updated = await this.usuarios.update(id, data);
    if (!updated) throw new Error("Usuario no existe");
    return updated;
  }

  async eliminarUsuario(id: number): Promise<void> {
    await this.obtenerUsuario(id);
    await this.usuarioAula.removeByUsuario(id);
    await this.mensajes.deleteByEmisor(id);
    const ok = await this.usuarios.delete(id);
    if (!ok) throw new Error("No se pudo eliminar el usuario");
  }

  // === Aulas ===
  async listarAulas(): Promise<Aula[]> {
    return this.aulas.listAll();
  }

  async obtenerAula(id: number): Promise<Aula> {
    const a = await this.aulas.getById(id);
    if (!a) throw new Error("Aula no existe");
    return a;
  }

  async crearAula(data: NuevaAula): Promise<Aula> {
    await this.validarAula(data);
    return this.aulas.add(data);
  }

  async actualizarAula(id: number, data: Partial<NuevaAula>): Promise<Aula> {
    const actual = await this.obtenerAula(id);
    await this.validarAula({ ...actual, ...data });
    const updated = await this.aulas.update(id, data);
    if (!updated) throw new Error("Aula no existe");
    return updated;
  }

  async eliminarAula(id: number): Promise<void> {
    await this.obtenerAula(id);
    const chatsAula = (await this.chats.listAll()).filter(c => c.aulaId === id);
    for (const c of chatsAula) {
      await this.mensajes.deleteByChat(c.id);
      await this.chats.delete(c.id);
    }
    await this.usuarioAula.removeByAula(id);
    const ok = await this.aulas.delete(id);
    if (!ok) throw new Error("No se pudo eliminar el aula");
  }

  // === Usuario - Aula ===
  async asignarUsuarioAAula(usuarioId: number, aulaId: number): Promise<void> {
    const u = await this.obtenerUsuario(usuarioId);
    const a = await this.obtenerAula(aulaId);
    if (!u || !a) return;
    const ya = await this.usuarioAula.findByUsuarioAndAula(usuarioId, aulaId);
    if (ya) {
      console.log(`[asignarUsuarioAAula] ya estaba inscrito: u=${usuarioId}, aula=${aulaId}`);
      return;
    }
    const ua = await this.usuarioAula.add(usuarioId, aulaId);
    console.log(`[asignarUsuarioAAula] OK -> UsuarioAula{id=${ua.id}, u=${usuarioId}, aula=${aulaId}}`);
  }

  async desasignarUsuarioAAula(usuarioId: number, aulaId: number): Promise<void> {
    const removed = await this.usuarioAula.remove(usuarioId, aulaId);
    if (!removed) throw new Error("No se encontro la inscripcion usuario/aula");
  }

  listarInscripciones() {
    return this.usuarioAula.listAll();
  }

  // === Chats ===
  async listarChats(): Promise<Chat[]> {
    return this.chats.listAll();
  }

  async obtenerChat(id: number): Promise<Chat> {
    const chat = await this.chats.getById(id);
    if (!chat) throw new Error("Chat no existe");
    return chat;
  }

  async crearChat(data: NuevoChat): Promise<Chat> {
    const payload = { ...data, tipo: data.tipo ? data.tipo.toUpperCase() : "" };
    await this.validarChat(payload);
    return this.chats.add(payload);
  }

  async actualizarChat(id: number, data: Partial<NuevoChat>): Promise<Chat> {
    const chatActual = await this.obtenerChat(id);
    const actualizado = { ...chatActual, ...data, tipo: data.tipo ? data.tipo.toUpperCase() : chatActual.tipo };
    await this.validarChat(actualizado);
    const updated = await this.chats.update(id, actualizado);
    if (!updated) throw new Error("Chat no existe");
    return updated;
  }

  async eliminarChat(id: number): Promise<void> {
    await this.obtenerChat(id);
    await this.mensajes.deleteByChat(id);
    const ok = await this.chats.delete(id);
    if (!ok) throw new Error("No se pudo eliminar el chat");
  }

  // === Pictogramas ===
  async listarPictogramas(): Promise<Pictograma[]> {
    const list = await this.pictos.listAll();
    console.log(`[listarPictogramas] total=${list.length}`);
    return list;
  }

  async obtenerPictograma(id: number): Promise<Pictograma> {
    const pic = await this.pictos.getById(id);
    if (!pic) throw new Error("Pictograma no existe");
    return pic;
  }

  async crearPictograma(data: NuevoPictograma): Promise<Pictograma> {
    this.validarPictograma(data);
    return this.pictos.add(data);
  }

  async actualizarPictograma(id: number, data: Partial<NuevoPictograma>): Promise<Pictograma> {
    const actual = await this.obtenerPictograma(id);
    this.validarPictograma({ ...actual, ...data });
    const updated = await this.pictos.update(id, data);
    if (!updated) throw new Error("Pictograma no existe");
    return updated;
  }

  async eliminarPictograma(id: number): Promise<void> {
    await this.obtenerPictograma(id);
    await this.mensajes.deleteByPictograma(id);
    const ok = await this.pictos.delete(id);
    if (!ok) throw new Error("No se pudo eliminar el pictograma");
  }

  // === Mensajes ===
  async enviarPictograma(chatId: number, emisorId: number, pictogramaId: number): Promise<MensajePictograma> {
    const user = await this.obtenerUsuario(emisorId);
    const chat = await this.obtenerChat(chatId);
    const pic = await this.obtenerPictograma(pictogramaId);
    if (!user || !chat || !pic) throw new Error("Datos invalidos para enviar mensaje");

    const estaEnAula = await this.usuarioAula.findByUsuarioAndAula(emisorId, chat.aulaId);
    if (!estaEnAula) throw new Error("Usuario no esta inscrito en el aula del chat");

    const msg = await this.mensajes.add(emisorId, chatId, pictogramaId);
    console.log(`[enviarPictograma] OK -> msg#${msg.id} emisor=${emisorId} pic=${pictogramaId} chat=${chatId}`);
    return msg;
  }

  async listarMensajes(chatId: number): Promise<MensajePictograma[]> {
    await this.obtenerChat(chatId);
    const list = await this.mensajes.listByChat(chatId);
    console.log(`[listarMensajes] chat=${chatId} total=${list.length}`);
    return list;
  }

  async actualizarMensaje(
    chatId: number,
    mensajeId: number,
    data: Partial<Pick<MensajePictograma, "emisorId" | "pictogramaId">>
  ) {
    const msg = await this.mensajes.getById(mensajeId);
    if (!msg || msg.chatId !== chatId) throw new Error("Mensaje no existe en el chat indicado");
    if (data.emisorId !== undefined) await this.obtenerUsuario(data.emisorId);
    if (data.pictogramaId !== undefined) await this.obtenerPictograma(data.pictogramaId);
    if (data.emisorId !== undefined) {
      const chat = await this.obtenerChat(chatId);
      const estaEnAula = await this.usuarioAula.findByUsuarioAndAula(data.emisorId, chat.aulaId);
      if (!estaEnAula) throw new Error("Usuario no esta inscrito en el aula del chat");
    }
    const updated = await this.mensajes.update(mensajeId, data);
    if (!updated) throw new Error("No se pudo actualizar el mensaje");
    return updated;
  }

  async eliminarMensaje(chatId: number, mensajeId: number) {
    const msg = await this.mensajes.getById(mensajeId);
    if (!msg || msg.chatId !== chatId) throw new Error("Mensaje no existe en el chat indicado");
    const ok = await this.mensajes.delete(mensajeId);
    if (!ok) throw new Error("No se pudo eliminar el mensaje");
    return msg;
  }

  // === Validaciones basicas ===
  private validarUsuario(usuario: NuevoUsuario) {
    if (!usuario.nombre?.trim()) throw new Error("Nombre de usuario obligatorio");
    if (typeof usuario.edad !== "number" || usuario.edad < 0) throw new Error("Edad invalida");
    const tipo = usuario.tipo?.toUpperCase();
    if (tipo !== "PROFESOR" && tipo !== "ALUMNO") throw new Error("Tipo de usuario debe ser PROFESOR o ALUMNO");
  }

  private async validarAula(aula: NuevaAula) {
    if (!aula.nombre?.trim()) throw new Error("Nombre de aula obligatorio");
    if (!aula.grado?.trim()) throw new Error("Grado obligatorio");
    const profe = await this.obtenerUsuario(aula.profesorEncargado);
    if (profe.tipo !== "PROFESOR") throw new Error("El profesorEncargado debe ser un usuario de tipo PROFESOR");
  }

  private async validarChat(chat: NuevoChat) {
    if (!chat.tipo?.trim()) throw new Error("Tipo de chat obligatorio");
    if (chat.tipo !== "AULA") throw new Error("Tipo de chat invalido, solo se admite AULA");
    await this.obtenerAula(chat.aulaId);
  }

  private validarPictograma(pic: NuevoPictograma) {
    if (!pic.url?.trim()) throw new Error("URL de pictograma obligatoria");
    if (!pic.titulo?.trim()) throw new Error("Titulo de pictograma obligatorio");
  }
}
