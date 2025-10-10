import { PictotapFacade } from "../services/PictotapFacade.js";

export class PictogramController {
  constructor(private facade: PictotapFacade) {}

  // Simula: GET /pictogramas
  listarPictogramas() {
    console.log(`(API) GET /pictogramas`);
    const list = this.facade.listarPictogramas();
    console.log("(API) 200 OK ->", list, "\n");
    return list;
  }
}
