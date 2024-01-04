import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        id, cuit, razon_social, abreviacion_razon_social, 
        COALESCE(telefono, '-') as telefono, 
        COALESCE(correo, '-') as correo, fecha_creacion
      FROM cliente WHERE activo=true`;

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

export const create = async ({ cuit, razon_social, abreviacion_razon_social, telefono, correo, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO cliente(cuit, razon_social, abreviacion_razon_social, telefono, correo, fecha_creacion, activo)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [cuit, razon_social, abreviacion_razon_social, telefono, correo, timestamp]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, cuit, razon_social, abreviacion_razon_social, telefono, correo, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE 
        cliente
      SET
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2
    `;

    const queryParams = [timestamp, userEmail];

    if (cuit !== undefined) {
      queryParams.push(cuit);
      query += ', cuit=$' + (queryParams.length);
    }

    if (razon_social !== undefined) {
      queryParams.push(razon_social);
      query += ', razon_social=$' + (queryParams.length);
    }

    if (abreviacion_razon_social !== undefined) {
      queryParams.push(abreviacion_razon_social);
      query += ', abreviacion_razon_social=$' + (queryParams.length);
    }

    if (telefono !== undefined) {
      queryParams.push(telefono);
      query += ', telefono=$' + (queryParams.length);
    }

    if (correo !== undefined) {
      queryParams.push(correo);
      query += ', correo=$' + (queryParams.length);
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
        cliente
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