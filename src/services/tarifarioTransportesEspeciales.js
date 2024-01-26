import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        tte.id,
        vt.id AS id_vehiculo_tipo,
        vt.descripcion AS vehiculo_tipo,
        z.id AS id_zona,
        z.descripcion AS zona,
        cl.id AS id_cliente,
        cl.abreviacion_razon_social AS cliente,
        tte.id_transporte,
        tr.nombre as transporte,
        tte.monto,
        to_char(tte.monto, '$999,999,999.99') AS monto_formateado,
        tte.monto_por_ayudante,
        to_char(tte.monto_por_ayudante, '$999,999,999.99') AS monto_por_ayudante_formateado,
        tte.fecha_desde,
        tte.fecha_hasta,
        TO_CHAR(tte.fecha_desde, 'DD/MM/YYYY') as fecha_desde_formateada,
        TO_CHAR(tte.fecha_hasta, 'DD/MM/YYYY') as fecha_hasta_formateada,
        tte.fecha_creacion,
        tte.fecha_ultima_edicion,
        tte.correo_ultima_edicion,
        tte.activo
      FROM 
        tarifario_transporte_especial tte
      LEFT JOIN vehiculo_tipo vt
        ON vt.id=tte.id_vehiculo_tipo
      LEFT JOIN zona z
        ON z.id=tte.id_zona
      LEFT JOIN transporte tr
        ON tr.id=tte.id_transporte
      LEFT JOIN cliente cl
        ON cl.id=tte.id_cliente
      WHERE
        tte.activo=TRUE
    `;

    let result;

    if (Boolean(id)) {
      query += ' and tte.id=$1';
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
  vehiculo_tipo, 
  zona, 
  transporte, 
  cliente,
  monto, 
  monto_por_ayudante, 
  fecha_desde, 
  fecha_hasta, 
  sobreescribir_tarifario,
  sobreescribir_tarifario_id,
  connection 
}) => {
  try {
    const timestamp = getTimestamp();
    const queryInsert = `
      INSERT INTO tarifario_transporte_especial (
        id_vehiculo_tipo, 
        id_zona, 
        id_transporte, 
        id_cliente,
        monto, 
        monto_por_ayudante, 
        fecha_desde, 
        fecha_hasta, 
        fecha_creacion, 
        activo
      ) VALUES ($1, $2, $3, $9, $4, $5, TO_DATE($6, 'YYYYMMDD'), TO_DATE($7, 'YYYYMMDD'), $8, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(queryInsert, [
      vehiculo_tipo, 
      zona, 
      transporte, 
      monto, 
      monto_por_ayudante, 
      fecha_desde, 
      fecha_hasta, 
      timestamp,
      cliente
    ]);

    if (sobreescribir_tarifario) {
      const queryUpdate = `
        UPDATE tarifario_transporte_especial
        SET
          fecha_hasta=TO_DATE($1, 'YYYYMMDD') - INTERVAL '1 day'
        WHERE
          id=$2
      `;
  
      await connection.queryWithParameters(queryUpdate, [
        fecha_desde,
        sobreescribir_tarifario_id
      ]);
    }

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, monto, monto_por_ayudante, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE 
        tarifario_transporte_especial
      SET
        correo_ultima_edicion=$1,
        fecha_ultima_edicion=$2
    `;

    let queryParams = [userEmail, timestamp];

    if (monto) {
      queryParams.push(monto);
      query += ', monto=$' + queryParams.length;
    }

    if (monto_por_ayudante) {
      queryParams.push(monto_por_ayudante);
      query += ', monto_por_ayudante=$' + queryParams.length;
    }

    queryParams.push(id);

    query += ' WHERE id=$' + queryParams.length;

    await connection.queryWithParameters(query, queryParams);

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
        tarifario_transporte_especial
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