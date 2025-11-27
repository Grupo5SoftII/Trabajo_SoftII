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
import pool from './infra/db.js'; // Usamos la conexión correcta

async function runDemo() {
  console.log("--- INICIANDO DEMO CON AZURE ---");

  // 1. Verificar conexión
  try {
      const res = await pool.query('SELECT NOW()');
      console.log('✅ Base de datos conectada. Hora servidor:', res.rows[0].now);
  } catch(e) {
      console.error("❌ Error fatal de conexión:", e);
      return;
  }

  // 2. Inicializar Facade con los Repositorios de Postgres
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

  // USAMOS IDs REALES (Basado en tu script SQL inicial)
  // Usuario 3: Manuel (Alumno)
  // Aula 1: Matemáticas
  // Chat 1: Chat de Matemáticas
  // Pictograma 1: Hola

  console.log("\n1. Listando Pictogramas existentes...");
  await pictCtl.listarPictogramas();

  console.log("\n2. Inscribiendo alumno Manuel (ID 3) en Aula (ID 1)...");
  try {
    await aulaCtl.asignarUsuarioAAula(3, 1);
  } catch (error) {
    console.log("   (El alumno ya estaba inscrito o hubo un error controlado)");
  }

  console.log("\n3. Manuel envía 'Hola' (ID 1) al chat (ID 1)...");
  await chatCtl.enviarPictograma(1, 3, 1); 

  console.log("\n4. Historial del Chat:");
  await chatCtl.listarMensajes(1);

  console.log("\n=== FIN DEMO EXITOSA ===");
  process.exit(0);
}

runDemo().catch(err => {
  console.error("Error en demo", err);
  process.exit(1);
});