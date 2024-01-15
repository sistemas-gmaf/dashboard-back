import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        vj.id,
        vj.fecha_salida,
        TO_CHAR(TO_DATE(vj.fecha_salida, 'YYYYMMDD'), 'DD/MM/YYYY') AS fecha_salida_formateada,
        cl.id AS cliente_id,
        cl.abreviacion_razon_social AS cliente,
        ch.id AS chofer_id,
        tr.id AS transporte_id,
        tr.nombre AS transporte,
        ch.nombre AS chofer,
        vht.id AS vehiculo_tipo_id,
        vht.descripcion AS vehiculo_tipo,     
        vh.patente AS vehiculo_patente,   
        z.descripcion AS zona,
        vje.descripcion AS estado
      FROM 
        viaje vj
      LEFT JOIN cliente cl
        ON vj.id_cliente=cl.id
      LEFT JOIN vehiculo vh
        ON vh.id=vj.id_vehiculo
      LEFT JOIN vehiculo_tipo vht
        ON vht.id=vh.id_vehiculo_tipo
      LEFT JOIN chofer_vehiculo chvh
        ON chvh.id_vehiculo=vh.id
      LEFT JOIN chofer ch
        ON ch.id=chvh.id_chofer
      LEFT JOIN zona z
        ON z.id=vj.id_zona_destino
      LEFT JOIN viaje_estado vje
        ON vje.id=vj.id_viaje_estado
      LEFT JOIN transporte_vehiculo tvh
        ON tvh.id_vehiculo=vh.id
      LEFT JOIN transporte tr
        ON tr.id=tvh.id_transporte
      LEFT JOIN viaje_tarifario vjtr
        ON vjtr.id_viaje=vj.id
      LEFT JOIN tarifario_cliente trcl
        ON trcl.id=vjtr.id_tarifario_cliente
      LEFT JOIN tarifario_transporte_general trtg
        ON trtg.id=vjtr.id_tarifario_transporte_general
      LEFT JOIN tarifario_transporte_especial trte
        ON trte.id=vjtr.id_tarifario_transporte_especial
      WHERE vj.activo=true
    `;

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

export const create = async ({ fecha_emision, fecha_pago, numero, banco, importe, referencia, proveedor, estado, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO cheque(
        fecha_emision, fecha_pago, numero, banco, importe, referencia, proveedor, estado, fecha_creacion, activo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [fecha_emision, fecha_pago, numero, banco, importe, referencia, proveedor, estado, timestamp]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, fecha_emision, fecha_pago, numero, banco, importe, referencia, proveedor, estado, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE 
        cheque
      SET
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2
    `;

    const queryParams = [timestamp, userEmail];

    if (fecha_emision !== undefined) {
      queryParams.push(fecha_emision);
      query += ', fecha_emision=$' + (queryParams.length);
    }

    if (fecha_pago !== undefined) {
      queryParams.push(fecha_pago);
      query += ', fecha_pago=$' + (queryParams.length);
    }

    if (numero !== undefined) {
      queryParams.push(numero);
      query += ', numero=$' + (queryParams.length);
    }

    if (banco !== undefined) {
      queryParams.push(banco);
      query += ', banco=$' + (queryParams.length);
    }

    if (importe !== undefined) {
      queryParams.push(importe);
      query += ', importe=$' + (queryParams.length);
    }

    if (referencia !== undefined) {
      queryParams.push(referencia);
      query += ', referencia=$' + (queryParams.length);
    }

    if (proveedor !== undefined) {
      queryParams.push(proveedor);
      query += ', proveedor=$' + (queryParams.length);
    }

    if (estado !== undefined) {
      queryParams.push(estado);
      query += ', estado=$' + (queryParams.length);
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
        cheque
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
