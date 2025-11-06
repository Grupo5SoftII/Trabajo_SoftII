import { PictotapFacade } from "../services/PictotapFacade.js";

export class ChatController {
  constructor(private facade: PictotapFacade) {}

  // Simula: POST /chats/:chatId/mensajes
  enviarPictograma(chatId: number, emisorId: number, pictogramaId: number) {
    console.log(`(API) POST /chats/${chatId}/mensajes body={emisorId:${emisorId}, pictogramaId:${pictogramaId}}`);
    const msg = this.facade.enviarPictograma(chatId, emisorId, pictogramaId);
    console.log("(API) 200 OK ->", msg, "\n");
    return msg;
  }

  // Simula: GET /chats/:chatId/mensajes
  listarMensajes(chatId: number) {
    console.log(`(API) GET /chats/${chatId}/mensajes`);
    const list = this.facade.listarMensajes(chatId);
    console.log("(API) 200 OK ->", list, "\n");
    return list;
  }
}
