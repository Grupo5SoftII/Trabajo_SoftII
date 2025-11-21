import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/pictotap";

console.log("[PostgresClient] connectionString =", connectionString);

const sslRequired = (process.env.PGSSLMODE || "").toLowerCase() === "require";

export const pool = new Pool({
  connectionString,
  ssl: sslRequired ? { rejectUnauthorized: false } : false,
});
