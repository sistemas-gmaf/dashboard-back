import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        id, titulo, COALESCE(descripcion, '-') as descripcion, 
        TO_CHAR(TO_DATE(fecha_limite, 'YYYYMMDD'), 'DD/MM/YYYY') AS fecha_limite_formateada,
        fecha_limite,
        cantidad_dias_aviso, fecha_creacion
      FROM recordatorio WHERE activo=true`;

    let result;

    if (Boolean(id)) {
      query += ' and id=$1';
      result = await dbConnection.query(query, [id]);
      result.rows = result.rows[0];
    } else {
      result = await dbConnection.query(query);
    }

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const create = async ({ titulo, descripcion, fecha_limite, cantidad_dias_aviso, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO recordatorio(titulo, descripcion, fecha_limite, cantidad_dias_aviso, fecha_creacion, activo)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [titulo, descripcion, fecha_limite, cantidad_dias_aviso, timestamp]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, titulo, descripcion, fecha_limite, cantidad_dias_aviso, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE 
        recordatorio
      SET
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2
    `;

    const queryParams = [timestamp, userEmail];

    if (titulo !== undefined) {
      queryParams.push(titulo);
      query += ', titulo=$' + (queryParams.length);
    }

    if (descripcion !== undefined) {
      queryParams.push(descripcion);
      query += ', descripcion=$' + (queryParams.length);
    }

    if (fecha_limite !== undefined) {
      queryParams.push(fecha_limite);
      query += ', fecha_limite=$' + (queryParams.length);
    }

    if (cantidad_dias_aviso !== undefined) {
      queryParams.push(cantidad_dias_aviso);
      query += ', cantidad_dias_aviso=$' + (queryParams.length);
    }

    query += ' WHERE id=$' + (queryParams.length + 1);

    await connection.queryWithParameters(query, queryParams.concat(id));

    return true;
  } catch (error) {
    throw error;
  }
}

export const softDelete = async ({ id, userEmail, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE 
        recordatorio
      SET
        activo=false, 
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2
      WHERE
        id=$3
    `;

    await connection.queryWithParameters(query, [timestamp, userEmail, id]);

    return true;
  } catch (error) {
    throw error;
  }
}