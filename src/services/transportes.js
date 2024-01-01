import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let result;
    let query = `
      SELECT 
        t.id, 
        t.nombre, 
        COALESCE(NULLIF(t.descripcion, ''), '-') as descripcion, 
        t.fecha_creacion, 
        t.fecha_ultima_edicion, 
        t.correo_ultima_edicion,
        doc_afip.drive_id_onedrive,
        doc_afip.item_id_onedrive,
        doc_afip.tipo_archivo as constancia_afip_filetype
      FROM 
        transporte as t
      LEFT JOIN (SELECT * from documentacion where tipo_documentacion='constancia_afip') as doc_afip
        ON doc_afip.id_poseedor=t.id and doc_afip.tipo_poseedor='transporte'
      WHERE
        t.activo=true`;
  
    if (Boolean(id)) {
      query += ` AND t.id=$1`;
      result = await dbConnection.query(query, [id]);
      result = result.rows[0];
    } else {
      result = await dbConnection.query(query);
      result = result.rows;
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export const create = async ({ nombre, descripcion, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO transporte(nombre, descripcion, fecha_creacion, activo)
      VALUES ($1, $2, $3, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [nombre, descripcion, timestamp]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, nombre, descripcion, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE 
        transporte
      SET
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2
    `;

    const queryParams = [timestamp, userEmail];

    if (nombre !== undefined) {
      query += ', nombre=$3';
      queryParams.push(nombre);
    }

    if (descripcion !== undefined) {
      query += ', descripcion=$' + (nombre !== undefined ? '4' : '3');
      queryParams.push(descripcion);
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
        transporte
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