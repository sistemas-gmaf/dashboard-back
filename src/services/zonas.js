import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `SELECT * FROM zona WHERE activo=TRUE`;

    if (id) {
      query += ' AND id=$1';
    }

    let result;
    
    if (id) {
      result = await dbConnection.query(query, [id]);
      return result.rows[0];
    } else {
      result = await dbConnection.query(query);
      return result.rows;
    }

  } catch (error) {
    throw error;
  }
}

export const getByTarifario = async ({ fecha_salida, cliente, vehiculo }) => {
  try {
    let query = `
      SELECT DISTINCT z.id, z.descripcion
      FROM zona z
      JOIN tarifario_cliente tc ON z.id = tc.id_zona
      WHERE TO_CHAR(tc.fecha_desde, 'YYYYMMDD') <= $1 
        AND COALESCE(TO_CHAR(tc.fecha_hasta, 'YYYYMMDD'), $1) >= $1 
        AND tc.id_cliente = $2 
        AND tc.id_vehiculo_tipo = (SELECT id_vehiculo_tipo FROM vehiculo WHERE id = $3)
        AND tc.activo=true
      UNION
      SELECT DISTINCT z.id, z.descripcion
      FROM zona z
      JOIN tarifario_transporte_especial te ON z.id = te.id_zona
      WHERE TO_CHAR(te.fecha_desde, 'YYYYMMDD') <= $1 
        AND COALESCE(TO_CHAR(te.fecha_hasta, 'YYYYMMDD'), $1) >= $1 
        AND te.id_cliente = $2 
        AND te.id_vehiculo_tipo = (SELECT id_vehiculo_tipo FROM vehiculo WHERE id = $3)
        AND te.activo=true
      UNION
      SELECT DISTINCT z.id, z.descripcion
      FROM zona z
      JOIN tarifario_transporte_general tg ON z.id = tg.id_zona
      WHERE TO_CHAR(tg.fecha_desde, 'YYYYMMDD') <= $1 
        AND COALESCE(TO_CHAR(tg.fecha_hasta, 'YYYYMMDD'), $1) >= $1 
        AND tg.id_cliente = $2 
        AND tg.id_vehiculo_tipo = (SELECT id_vehiculo_tipo FROM vehiculo WHERE id = $3)
        AND tg.activo=true    
    `;
    
    const result = await dbConnection.query(query, [fecha_salida, cliente, vehiculo]);
    
    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const create = async ({ descripcion, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO zona(
        descripcion, fecha_creacion, activo
      )
      VALUES (UPPER($1), $2, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [descripcion, timestamp]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, descripcion, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE zona SET
        descripcion=$1, 
        fecha_ultima_edicion=$2, 
        correo_ultima_edicion=$3
      WHERE
        id=$4
    `;

    const result = await connection.queryWithParameters(query, [descripcion, timestamp, userEmail, id]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const softDelete = async ({ id, userEmail, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE zona SET
        activo=false, 
        fecha_ultima_edicion=$1, 
        correo_ultima_edicion=$2
      WHERE
        id=$3
    `;

    const result = await connection.queryWithParameters(query, [timestamp, userEmail, id]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const getByDescripcion = async ({ descripcion }) => {
  try {
    const query = `SELECT * FROM zona WHERE descripcion=$1`;

    const result = await dbConnection.query(query, [descripcion]);

    if (result.rowCount === 0) {
      return false;
    }

    return result.rows[0].id;
  } catch (error) {
    throw error;    
  }
}

export const upsert = async({ descripcion, connection }) => {
  try {
    const timestamp = getTimestamp();

    const query = `
      INSERT INTO zona (descripcion, fecha_creacion)
        VALUES ($1, $2)
      ON CONFLICT (descripcion) DO 
        UPDATE SET descripcion = EXCLUDED.descripcion
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [descripcion, timestamp]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}