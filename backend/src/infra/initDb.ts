import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./PostgresClient.js";   // o "./PostgresClient" según tu config

export async function initDb() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const schemaPath = path.join(__dirname, "sql", "schema.sql");

  console.log("[db] Usando DATABASE_URL:", process.env.DATABASE_URL);

  const sql = await readFile(schemaPath, "utf8");
  await pool.query(sql);
  console.log("[db] Esquema y seed verificados/aplicados");
}


