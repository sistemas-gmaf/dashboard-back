import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT * FROM (SELECT
        ROW_NUMBER() OVER () AS id,
        v.id as id_vehiculo,
        v.patente as vehiculo_patente,
        v.fecha_creacion as vehiculo_fecha_creacion,
        vt.id as vehiculo_tipo_id,
        vt.descripcion as vehiculo_tipo_descripcion,
        c.id as chofer_id,
        c.nombre as chofer_nombre,
        COALESCE(c.dni, '-') as chofer_dni,
        t.id as transporte_id,
        t.nombre as transporte_nombre,
        t.descripcion as transporte_descripcion,
        doc_vtv.drive_id_onedrive,
        doc_vtv.item_id_onedrive,
        doc_vtv.tipo_archivo as vtv_filetype
      FROM 
        vehiculo as v
        left join vehiculo_tipo as vt
          on v.id_vehiculo_tipo = vt.id
        left join chofer_vehiculo as cv
          on v.id=cv.id_vehiculo
        left join chofer as c
          on cv.id_chofer=c.id
        left join transporte_vehiculo as tv
          on tv.id_vehiculo=v.id
        left join transporte as t
          on t.id=tv.id_transporte
        left join (select * from documentacion where tipo_documentacion='vtv') as doc_vtv
          on doc_vtv.id_poseedor=v.id and doc_vtv.tipo_poseedor='vehiculo'
      WHERE v.activo=true`;
    
    let result;

    if (Boolean(id)) {
      query += ' ORDER by v.id, c.id ASC) t1 WHERE t1.id=$1 ORDER BY t1.id';
    } else {
      query += ' ORDER by v.id, c.id ASC) t1 ORDER BY t1.id';
    }

    if (Boolean(id)) {
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
  chofer, 
  patente, 
  transporte, 
  vehiculo_tipo,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const queryInsertVehiculo = `INSERT INTO vehiculo (
        patente, 
        id_vehiculo_tipo,
        fecha_creacion,
        activo
      ) values (
        UPPER(TRIM($1)), $2, $3, true
      )
      RETURNING id`;

    const vehiculoResult = await connection.queryWithParameters(queryInsertVehiculo, [
      patente, 
      vehiculo_tipo, 
      timestamp
    ]);
    const vehiculoId = vehiculoResult.rows[0].id;

    const queryInsertChoferVehiculo = `INSERT INTO chofer_vehiculo (
      id_chofer,
      id_vehiculo,
      fecha_creacion,
      activo
    ) values (
      $1, $2, $3, true
    )`;
    await connection.queryWithParameters(queryInsertChoferVehiculo, [
      chofer, 
      vehiculoId, 
      timestamp
    ]);

    const queryInsertTransporteVehiculo = `INSERT INTO transporte_vehiculo(
      id_transporte,
      id_vehiculo,
      fecha_creacion,
      activo
    ) values (
      $1, $2, $3, true
    )`;
    await connection.queryWithParameters(queryInsertTransporteVehiculo, [
      transporte, 
      vehiculoId, 
      timestamp
    ]);
    
    return vehiculoId;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, patente, vehiculo_tipo, userEmail, connection }) => {
  try {
    const timestamp = getTimestamp();

    if (Boolean(patente)) {
      const query = `
        UPDATE 
          vehiculo 
        SET 
          patente=UPPER(TRIM($1)),
          fecha_ultima_edicion=$2,
          correo_ultima_edicion=$3
        WHERE
          id=$4
      `;
      await connection.queryWithParameters(query, [patente, timestamp, userEmail, id]);
    }
    if (Boolean(vehiculo_tipo)) {
      const query = `
        UPDATE 
          vehiculo 
        SET 
          id_vehiculo_tipo=$1,
          fecha_ultima_edicion=$2,
          correo_ultima_edicion=$3
        WHERE
          id=$4
      `;
      await connection.queryWithParameters(query, [vehiculo_tipo, timestamp, userEmail, id]);
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
        vehiculo 
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

export const getTipos = async () => {
  try {
    const query = 'SELECT * FROM vehiculo_tipo';
  
    const result = await dbConnection.query(query);
  
    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const getTiposByDescripcion = async ({ descripcion }) => {
  try {
    const query = `SELECT * FROM vehiculo_tipo WHERE descripcion=$1`;

    const result = await dbConnection.query(query, [descripcion]);

    if (result.rowCount === 0) {
      return false;
    }

    return result.rows[0].id;
  } catch (error) {
    throw error;    
  }
}

export const upsertTipos = async ({ descripcion, connection }) => {
  try {
    const timestamp = getTimestamp();
    const query = `
      INSERT INTO vehiculo_tipo (descripcion, fecha_creacion)
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