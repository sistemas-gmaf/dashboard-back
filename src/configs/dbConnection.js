import { 
  DB_DATABASE, 
  DB_HOST, 
  DB_PASSWORD, 
  DB_PORT, 
  DB_USER
} from '../configs/app.js';
import pg from 'pg';

// Configuración de la conexión a PostgreSQL
export const dbConnection = new pg.Pool({
  // Configura tu conexión PostgreSQL aquí
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

/**
 * @description Crea una transaccion a la BD y devuelve los manejadores de transaccion
 */
export const createTransaction = async () => {
  const connection = await dbConnection.connect();
  await connection.query('BEGIN');

  const commit = async () => {
    await connection.query('COMMIT');
    await connection.release();
  };
  const rollback = async () => {
    await connection.query('COMMIT');
    await connection.release();
  };
  const queryWithParameters = async (query, params) => {
    await connection.query(query, params);
  }

  return {
    commit,
    rollback,
    queryWithParameters
  }
}