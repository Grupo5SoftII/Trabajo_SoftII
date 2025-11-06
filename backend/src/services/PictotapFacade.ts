import {
  UsuarioRepo, AulaRepo, UsuarioAulaRepo, ChatRepo,
  PictogramaRepo, MensajePictogramaRepo
} from "../infra/Repositories.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";
import { Pictograma } from "../domain/Pictograma.js";

export class PictotapFacade {
  constructor(
    private usuarios: UsuarioRepo,
    private aulas: AulaRepo,
    private usuarioAula: UsuarioAulaRepo,
    private chats: ChatRepo,
    private pictos: PictogramaRepo,
    private mensajes: MensajePictogramaRepo
  ) {}

  // asignarUsuarioAAula(usuarioId, aulaId)
  asignarUsuarioAAula(usuarioId: number, aulaId: number): void {
    const u = this.usuarios.getById(usuarioId);
    const a = this.aulas.getById(aulaId);
    if (!u) throw new Error("Usuario no existe");
    if (!a) throw new Error("Aula no existe");
    const ya = this.usuarioAula.findByUsuarioAndAula(usuarioId, aulaId);
    if (ya) {
      console.log(`[asignarUsuarioAAula] ya estaba inscrito: u=${usuarioId}, aula=${aulaId}`);
      return;
    }
    const ua = this.usuarioAula.add(usuarioId, aulaId);
    console.log(`[asignarUsuarioAAula] OK -> UsuarioAula{id=${ua.id}, u=${usuarioId}, aula=${aulaId}}`);
  }

  // listarPictogramas()
  listarPictogramas(): Pictograma[] {
    const list = this.pictos.listAll();
    console.log(`[listarPictogramas] total=${list.length}`);
    return list;
  }

  // enviarPictograma(chatId, emisorId, pictogramaId)
  enviarPictograma(chatId: number, emisorId: number, pictogramaId: number): MensajePictograma {
    const user = this.usuarios.getById(emisorId);
    if (!user) throw new Error("Emisor no existe");
    const pic = this.pictos.getById(pictogramaId);
    if (!pic) throw new Error("Pictograma no existe");
    const msg = this.mensajes.add(emisorId, chatId, pictogramaId);
    console.log(`[enviarPictograma] OK -> msg#${msg.id} emisor=${emisorId} pic=${pictogramaId} chat=${chatId}`);
    return msg;
  }

  // listarMensajes(chatId)
  listarMensajes(chatId: number): MensajePictograma[] {
    const list = this.mensajes.listByChat(chatId);
    console.log(`[listarMensajes] chat=${chatId} total=${list.length}`);
    return list;
  }
}
