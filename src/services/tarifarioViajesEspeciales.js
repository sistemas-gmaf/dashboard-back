import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        tve.id,
        tve.id_viaje,

        tve.monto_cliente,
        to_char(tve.monto_cliente, '$999,999,999.99') AS monto_cliente_formateado,

        tve.monto_cliente_por_ayudante,
        to_char(tve.monto_cliente_por_ayudante, '$999,999,999.99') AS monto_cliente_por_ayudante_formateado,

        tve.monto_transporte,
        to_char(tve.monto_transporte, '$999,999,999.99') AS monto_transporte_formateado,

        tve.monto_transporte_por_ayudante,
        to_char(tve.monto_transporte_por_ayudante, '$999,999,999.99') AS monto_transporte_por_ayudante_formateado,

        tve.aprobado,
        tve.fecha_creacion,
        vj.fecha_salida,
        TO_CHAR(TO_DATE(vj.fecha_salida, 'YYYYMMDD'), 'DD/MM/YYYY') AS fecha_salida_formateada,
        ch.nombre AS chofer,
        vht.descripcion AS vehiculo_tipo,
        z.descripcion AS zona,
        cl.abreviacion_razon_social AS cliente,
        tr.nombre as transporte,
        CASE
          WHEN tve.aprobado=TRUE THEN 'APROBADO'
          WHEN tve.aprobado=FALSE THEN 'RECHAZADO'
          ELSE 'PENDIENTE'
        END AS estado,
        vj.correo_ultima_edicion AS viaje_correo_ultima_edicion,
        vj.cantidad_ayudantes
      FROM
        tarifario_viaje_especial tve
      LEFT JOIN viaje vj
        ON tve.id_viaje=vj.id
      LEFT JOIN vehiculo vh
        ON vj.id_vehiculo=vh.id
      LEFT JOIN vehiculo_tipo vht
        ON vh.id_vehiculo_tipo=vht.id
      LEFT JOIN chofer_vehiculo chv
        ON chv.id_vehiculo=vh.id
      LEFT JOIN chofer ch
        ON ch.id=chv.id_chofer
      LEFT JOIN zona z
        ON vj.id_zona_destino=z.id
      LEFT JOIN cliente cl
        ON cl.id=vj.id_cliente
      LEFT JOIN transporte_vehiculo tvh
        ON tvh.id_vehiculo=vj.id_vehiculo
      LEFT JOIN transporte tr
        ON tr.id=tvh.id_transporte
      WHERE 
        tve.activo=TRUE
    `;

    let result;

    if (Boolean(id)) {
      query += ' and tve.id=$1';
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

export const createTarifarioCliente = async ({ 
  id_vehiculo_tipo, 
  id_zona, 
  id_cliente, 
  monto, 
  monto_por_ayudante, 
  fecha_desde, 
  fecha_hasta, 
  connection 
}) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO tarifario_cliente (
        id_vehiculo_tipo, 
        id_zona, 
        id_cliente, 
        monto, 
        monto_por_ayudante, 
        fecha_desde, 
        fecha_hasta, 
        fecha_creacion, 
        activo
      ) VALUES (@1, @2, @3, @4, @5, TO_DATE(@6, 'YYYYMMDD'), TO_DATE(@7, 'YYYYMMDD'), @8, true);
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [
      id_vehiculo_tipo, 
      id_zona, 
      id_cliente, 
      monto, 
      monto_por_ayudante, 
      fecha_desde, 
      fecha_hasta, 
      timestamp
    ]);

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