import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT
        id, fecha_emision, fecha_pago, 
        TO_CHAR(TO_DATE(fecha_emision, 'YYYYMMDD'), 'DD/MM/YYYY') AS fecha_emision_formateada,
        TO_CHAR(TO_DATE(fecha_pago, 'YYYYMMDD'), 'DD/MM/YYYY') AS fecha_pago_formateada,
        numero, banco, importe,
        TO_CHAR(importe, '$999,999,999.99') AS importe_formateado,
        referencia, proveedor, UPPER(estado) as estado, fecha_creacion, 
        fecha_ultima_edicion, correo_ultima_edicion
      FROM cheque WHERE activo=TRUE`;

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
      VALUES ($1, $2, $3, UPPER(TRIM($4)), $5, UPPER(TRIM($6)), UPPER(TRIM($7)), UPPER(TRIM($8)), $9, true)
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
      query += ', banco=UPPER(TRIM($' + (queryParams.length) + '))';
    }

    if (importe !== undefined) {
      queryParams.push(importe);
      query += ', importe=$' + (queryParams.length);
    }

    if (referencia !== undefined) {
      queryParams.push(referencia);
      query += ', referencia=UPPER(TRIM($' + (queryParams.length) + '))';
    }

    if (proveedor !== undefined) {
      queryParams.push(proveedor);
      query += ', proveedor=UPPER(TRIM($' + (queryParams.length) + '))';
    }

    if (estado !== undefined) {
      queryParams.push(estado);
      query += ', estado=UPPER(TRIM($' + (queryParams.length) + '))';
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

export const getBancos = async () => {
  try {
    let query = `
      SELECT DISTINCT
        banco as id, banco as descripcion
      FROM cheque WHERE activo=TRUE`;

    let result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const getReferencias = async () => {
  try {
    let query = `
      SELECT DISTINCT
        referencia as id, referencia as descripcion
      FROM cheque WHERE activo=TRUE`;

    let result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const getProveedores = async () => {
  try {
    let query = `
      SELECT DISTINCT
        proveedor as id, proveedor as descripcion
      FROM cheque WHERE activo=TRUE`;

    let result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const getEstados = async () => {
  try {
    let query = `
      SELECT DISTINCT
        estado as id, estado as descripcion
      FROM cheque WHERE activo=TRUE`;

    let result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}