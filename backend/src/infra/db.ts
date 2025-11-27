import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_HOST) {
  console.error('Error: Falta configurar el archivo .env');
  process.exit(1);
}

// Configuración de la conexión
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Conexión establecida con Azure PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PG', err);
  process.exit(-1);
});

export default pool;