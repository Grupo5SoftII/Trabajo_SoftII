import { PictotapFacade } from "../services/PictotapFacade.js";

export class AulaController {
  constructor(private facade: PictotapFacade) {}

  // Simula: POST /aulas/:aulaId/usuarios/:usuarioId
  async asignarUsuarioAAula(usuarioId: number, aulaId: number) {
    console.log(`(API) POST /aulas/${aulaId}/usuarios/${usuarioId}`);
    await this.facade.asignarUsuarioAAula(usuarioId, aulaId);
    console.log(`(API) 200 OK\n`);
  }
}
