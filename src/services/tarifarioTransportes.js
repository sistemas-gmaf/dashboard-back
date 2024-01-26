import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        ttg.id,
        vt.id AS id_vehiculo_tipo,
        vt.descripcion AS vehiculo_tipo,
        z.id AS id_zona,
        z.descripcion AS zona,
        cl.id AS id_cliente,
        cl.abreviacion_razon_social as cliente,
        ttg.monto,
        to_char(ttg.monto, '$999,999,999.99') AS monto_formateado,
        ttg.monto_por_ayudante,
        to_char(ttg.monto_por_ayudante, '$999,999,999.99') AS monto_por_ayudante_formateado,
        ttg.fecha_desde,
        ttg.fecha_hasta,
        TO_CHAR(ttg.fecha_desde, 'DD/MM/YYYY') as fecha_desde_formateada,
        TO_CHAR(ttg.fecha_hasta, 'DD/MM/YYYY') as fecha_hasta_formateada,
        ttg.fecha_creacion,
        ttg.fecha_ultima_edicion,
        ttg.correo_ultima_edicion,
        ttg.activo
      FROM 
        tarifario_transporte_general ttg
      LEFT JOIN vehiculo_tipo vt
        ON vt.id=ttg.id_vehiculo_tipo
      LEFT JOIN zona z
        ON z.id=ttg.id_zona
      LEFT JOIN cliente cl
       ON ttg.id_cliente=cl.id
      WHERE
        ttg.activo=TRUE
    `;

    let result;

    if (Boolean(id)) {
      query += ' and ttg.id=$1';
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
      INSERT INTO tarifario_transporte_general (
        id_vehiculo_tipo, 
        id_zona, 
        monto, 
        monto_por_ayudante, 
        fecha_desde, 
        fecha_hasta, 
        fecha_creacion, 
        activo
      ) VALUES ($1, $2, $3, $4, TO_DATE($5, 'YYYYMMDD'), TO_DATE(5, 'YYYYMMDD'), $7, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(queryInsert, [
      vehiculo_tipo, 
      zona, 
      monto, 
      monto_por_ayudante, 
      fecha_desde, 
      fecha_hasta, 
      timestamp
    ]);

    if (sobreescribir_tarifario) {
      const queryUpdate = `
        UPDATE tarifario_transporte_general
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
        tarifario_transporte_general
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
        tarifario_transporte_general
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

export const massiveUpsert = async ({
  vehiculo_tipo,
  zona,
  cliente,
  monto,
  monto_por_ayudante,
  fecha_desde,
  userEmail,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const queryGetIdExisting = `
      SELECT id
      FROM tarifario_transporte_general
      WHERE id_vehiculo_tipo = $1
          AND id_zona = $2
          AND id_cliente = $3
          AND fecha_desde < TO_DATE($4, 'YYYYMMDD')
          AND COALESCE(fecha_hasta, TO_DATE($4, 'YYYYMMDD')) >= TO_DATE($4, 'YYYYMMDD')
          AND activo=true
    `;

    const queryGetIdExistingWithSameDate = `
      SELECT id
      FROM tarifario_transporte_general
      WHERE id_vehiculo_tipo = $1
          AND id_zona = $2
          AND id_cliente = $3
          AND fecha_desde = TO_DATE($4, 'YYYYMMDD')
          AND COALESCE(fecha_hasta, TO_DATE($4, 'YYYYMMDD')) >= TO_DATE($4, 'YYYYMMDD')
          AND activo=true
    `;

    const queryUpdateExisting = `
      UPDATE tarifario_transporte_general
      SET fecha_hasta = TO_DATE($1, 'YYYYMMDD') - INTERVAL '1 day',
          fecha_ultima_edicion = $2,
          correo_ultima_edicion = $3
      WHERE id = $4
    `;

    const queryDeleteWithSameDate = `
      UPDATE tarifario_transporte_general
      SET activo = false,
          fecha_ultima_edicion = $1,
          correo_ultima_edicion = $2
      WHERE id = $3
    `;

    const queryInsertNew = `
      INSERT INTO tarifario_transporte_general (
        id_vehiculo_tipo, 
        id_zona, 
        id_cliente,
        monto, 
        monto_por_ayudante,
        fecha_desde,
        fecha_creacion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
    `;

    const resultGetExisting = await connection.queryWithParameters(queryGetIdExisting, [
      vehiculo_tipo, zona, cliente, fecha_desde
    ]);

    const resultGetExistingWithSameDate = await connection.queryWithParameters(queryGetIdExistingWithSameDate, [
      vehiculo_tipo, zona, cliente, fecha_desde
    ]);

    // Si hay un tarifario anterior a la fecha_desde se finaliza en el dia anterior
    if (resultGetExisting.rows.length > 0) {
      const idExisting = resultGetExisting.rows[0].id;

      await connection.queryWithParameters(queryUpdateExisting, [
        fecha_desde, timestamp, userEmail, idExisting
      ]);
    }

    // Si hay un tarifario con la misma fecha_desde se inhabilita para guardar el nuevo
    if (resultGetExistingWithSameDate.rows.length > 0) {
      const idExisting = resultGetExistingWithSameDate.rows[0].id;

      await connection.queryWithParameters(queryDeleteWithSameDate, [
        timestamp, userEmail, idExisting
      ]);
    }

    await connection.queryWithParameters(queryInsertNew, [
      vehiculo_tipo, zona, cliente, monto, monto_por_ayudante, fecha_desde, timestamp
    ]);

    return true;
  } catch (error) {
    throw error;
  }
}