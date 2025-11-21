import "dotenv/config";
import { initDb } from "../infra/initDb.js";
import { pool } from "../infra/PostgresClient.js";

// Script para inicializar la base de datos
initDb()
  .then(async () => {
    console.log("[db] Ready");
    await pool.end();
    process.exit(0);
  })
  .catch(err => {
    console.error("[db] Error inicializando", err);
    process.exit(1);
  });