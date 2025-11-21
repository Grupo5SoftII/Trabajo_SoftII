import {
  PostgresAulaRepo,
  PostgresChatRepo,
  PostgresMensajePictogramaRepo,
  PostgresPictogramaRepo,
  PostgresUsuarioAulaRepo,
  PostgresUsuarioRepo
} from "./infra/PostgresRepositories.js";
import { PictotapFacade } from "./services/PictotapFacade.js";
import { AulaController } from "./controllers/AulaController.js";
import { ChatController } from "./controllers/ChatController.js";
import { PictogramController } from "./controllers/PictogramController.js";
import { initDb } from "./infra/initDb.js";

async function runDemo() {
  await initDb();

  const facade = new PictotapFacade(
    new PostgresUsuarioRepo(),
    new PostgresAulaRepo(),
    new PostgresUsuarioAulaRepo(),
    new PostgresChatRepo(),
    new PostgresPictogramaRepo(),
    new PostgresMensajePictogramaRepo()
  );

  const aulaCtl = new AulaController(facade);
  const chatCtl = new ChatController(facade);
  const pictCtl = new PictogramController(facade);

  console.log("=== PICTOTAP DEMO (PostgreSQL) ===\n");

  await pictCtl.listarPictogramas();

  await aulaCtl.asignarUsuarioAAula(2, 10);
  await aulaCtl.asignarUsuarioAAula(3, 10);
  await aulaCtl.asignarUsuarioAAula(2, 10); // repetido (no duplica)

  await chatCtl.enviarPictograma(100, 2, 1000); // Luis: HOLA
  await chatCtl.enviarPictograma(100, 3, 1002); // Mia: AGUA
  await chatCtl.enviarPictograma(100, 2, 1001); // Luis: BANO

  await chatCtl.listarMensajes(100);

  console.log("\n=== FIN DEMO ===");
}

runDemo().catch(err => {
  console.error("Error en demo", err);
  process.exit(1);
});
