import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        c.id, c.categoria,
        c.razon_social, c.referencia,
        c.importe, c.fecha, TO_CHAR(TO_DATE(fecha, 'YYYYMMDD'), 'DD/MM/YYYY') AS fecha_formateada,
        c.estado, c.fecha_creacion
      FROM
        compromiso as c
      WHERE
        c.activo=true`;

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

export const create = async ({ categoria, razon_social, referencia, estado, fecha, importe, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO compromiso(
        categoria, razon_social, referencia, estado, fecha, importe, fecha_creacion, activo
      )
      VALUES (UPPER(TRIM($1)), UPPER(TRIM($2)), UPPER(TRIM($3)), UPPER(TRIM($4)), $5, $6, $7, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [
      categoria, razon_social, referencia, estado, fecha, importe, timestamp
    ]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, categoria, razon_social, referencia, estado, fecha, importe, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE 
        compromiso
      SET
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2
    `;

    const queryParams = [timestamp, userEmail];

    if (categoria !== undefined) {
      queryParams.push(categoria);
      query += ', categoria=UPPER(TRIM($' + (queryParams.length) + '))';
    }

    if (razon_social !== undefined) {
      queryParams.push(razon_social);
      query += ', razon_social=UPPER(TRIM($' + (queryParams.length) + '))';
    }

    if (referencia !== undefined) {
      queryParams.push(referencia);
      query += ', referencia=UPPER(TRIM($' + (queryParams.length) + '))';
    }

    if (estado !== undefined) {
      queryParams.push(estado);
      query += ', estado=UPPER(TRIM($' + (queryParams.length) + '))';
    }

    if (fecha !== undefined) {
      queryParams.push(fecha);
      query += ', fecha=$' + (queryParams.length);
    }

    if (importe !== undefined) {
      queryParams.push(importe);
      query += ', importe=$' + (queryParams.length);
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
        compromiso
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

export const getCategorias = async () => {
  try {
    const query = ` 
      SELECT DISTINCT c.categoria AS id, c.categoria AS descripcion
      FROM compromiso c WHERE c.activo=TRUE
    `;

    const result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const getRazonesSociales = async () => {
  try {
    const query = ` 
      SELECT DISTINCT c.razon_social AS id, c.razon_social AS descripcion
      FROM compromiso c WHERE c.activo=TRUE
    `;

    const result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const getReferencias = async () => {
  try {
    const query = ` 
      SELECT DISTINCT c.referencia AS id, c.referencia AS descripcion
      FROM compromiso c WHERE c.activo=TRUE
    `;

    const result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const getEstados = async () => {
  try {
    const query = ` 
      SELECT DISTINCT c.estado AS id, c.estado AS descripcion
      FROM compromiso c WHERE c.activo=TRUE
    `;

    const result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}