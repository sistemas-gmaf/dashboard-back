import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        c.id,
        c.nombre,
        COALESCE(c.celular, '-') as celular,
        COALESCE(c.dni, '-') as dni,
        COALESCE(c.correo, '-') as correo,
        c.fecha_creacion,
        
        doc_dni_frente.drive_id_onedrive AS dni_frente_drive_id,
        doc_dni_frente.item_id_onedrive AS dni_frente_item_id,
        doc_dni_frente.tipo_archivo AS dni_frente_filetype,
        
        doc_dni_dorso.drive_id_onedrive AS dni_dorso_drive_id,
        doc_dni_dorso.item_id_onedrive AS dni_dorso_item_id,
        doc_dni_dorso.tipo_archivo AS dni_dorso_filetype,
        
        doc_licencia_conducir_frente.drive_id_onedrive AS licencia_conducir_frente_drive_id,
        doc_licencia_conducir_frente.item_id_onedrive AS licencia_conducir_frente_item_id,
        doc_licencia_conducir_frente.tipo_archivo AS licencia_conducir_frente_filetype,

        doc_licencia_conducir_dorso.drive_id_onedrive AS licencia_conducir_dorso_drive_id,
        doc_licencia_conducir_dorso.item_id_onedrive AS licencia_conducir_dorso_item_id,
        doc_licencia_conducir_dorso.tipo_archivo AS licencia_conducir_dorso_filetype,
        
        doc_seguro_vehiculo.drive_id_onedrive AS seguro_vehiculo_drive_id,
        doc_seguro_vehiculo.item_id_onedrive AS seguro_vehiculo_item_id,
        doc_seguro_vehiculo.tipo_archivo AS seguro_vehiculo_filetype,
        
        doc_seguro_vida.drive_id_onedrive AS seguro_vida_drive_id,
        doc_seguro_vida.item_id_onedrive AS seguro_vida_item_id,
        doc_seguro_vida.tipo_archivo AS seguro_vida_filetype
      FROM 
        chofer AS C
      LEFT JOIN (SELECT * FROM documentacion WHERE tipo_documentacion='dni_frente') AS doc_dni_frente
        ON doc_dni_frente.id_poseedor=c.id AND doc_dni_frente.tipo_poseedor='chofer'
        
      LEFT JOIN (SELECT * FROM documentacion WHERE tipo_documentacion='dni_dorso') AS doc_dni_dorso
        ON doc_dni_dorso.id_poseedor=c.id AND doc_dni_dorso.tipo_poseedor='chofer'
        
      LEFT JOIN (SELECT * FROM documentacion WHERE tipo_documentacion='licencia_conducir_frente') AS doc_licencia_conducir_frente
        ON doc_licencia_conducir_frente.id_poseedor=c.id AND doc_licencia_conducir_frente.tipo_poseedor='chofer'

      LEFT JOIN (SELECT * FROM documentacion WHERE tipo_documentacion='licencia_conducir_dorso') AS doc_licencia_conducir_dorso
        ON doc_licencia_conducir_dorso.id_poseedor=c.id AND doc_licencia_conducir_dorso.tipo_poseedor='chofer'
        
      LEFT JOIN (SELECT * FROM documentacion WHERE tipo_documentacion='seguro_vehiculo') AS doc_seguro_vehiculo
        ON doc_seguro_vehiculo.id_poseedor=c.id AND doc_seguro_vehiculo.tipo_poseedor='chofer'
        
      LEFT JOIN (SELECT * FROM documentacion WHERE tipo_documentacion='seguro_vida') AS doc_seguro_vida
        ON doc_seguro_vida.id_poseedor=c.id AND doc_seguro_vida.tipo_poseedor='chofer'
        
      WHERE 
        c.activo=TRUE
    `;

    let result;

    if (Boolean(id)) {
      query += ' and c.id=$1';
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

export const create = async ({ 
  nombre, 
  dni, 
  celular, 
  correo,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const queryInsertChofer = `INSERT INTO chofer (
        nombre, 
        dni, 
        celular, 
        correo,
        fecha_creacion,
        activo
      ) values (
        UPPER(TRIM($1)), $2, $3, LOWER(TRIM($4)), $5, true
      )
      RETURNING id`;

    const choferResult = await connection.queryWithParameters(queryInsertChofer, [
      nombre, 
      dni, 
      celular, 
      correo,
      timestamp
    ]);

    const choferId = choferResult.rows[0].id;
  
    return choferId;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ 
  id, nombre, dni, celular, correo, userEmail, connection 
}) => {
  try {
    const timestamp = getTimestamp();

    if (nombre) {
      const query = `
        UPDATE chofer SET
          nombre=UPPER(TRIM($1)), fecha_ultima_edicion=$2, correo_ultima_edicion=$3
        WHERE id=$4
      `;
  
      await connection.queryWithParameters(query, [
        nombre, timestamp, userEmail, id 
      ]);
    }

    if (dni) {
      const query = `
        UPDATE chofer SET
          dni=$1, fecha_ultima_edicion=$2, correo_ultima_edicion=$3
        WHERE id=$4
      `;
  
      await connection.queryWithParameters(query, [
        dni, timestamp, userEmail, id 
      ]);
    }

    if (celular) {
      const query = `
        UPDATE chofer SET
          celular=$1, fecha_ultima_edicion=$2, correo_ultima_edicion=$3
        WHERE id=$4
      `;
  
      await connection.queryWithParameters(query, [
        celular, timestamp, userEmail, id 
      ]);
    }

    if (correo) {
      const query = `
        UPDATE chofer SET
          correo=LOWER(TRIM($1)), fecha_ultima_edicion=$2, correo_ultima_edicion=$3
        WHERE id=$4
      `;
  
      await connection.queryWithParameters(query, [
        correo, timestamp, userEmail, id 
      ]);
    }

    return true;
  } catch (error) {
    throw error;
  }
}

export const softDelete = async ({ id, userEmail, connection }) => {
  try {
    const timestamp = getTimestamp();
    const query = `
      UPDATE 
        chofer 
      SET 
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2,
        activo=false 
      WHERE 
        id=$3
    `;
    connection.queryWithParameters(query, [timestamp, userEmail, id]);

    return true;
  } catch (error) {
    throw error;
  }
}