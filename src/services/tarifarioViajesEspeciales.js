import { getTimestamp } from "../utils/time.js";

export const create = async ({ 
  monto_cliente, 
  monto_cliente_por_ayudante,
  monto_transporte,
  monto_transporte_por_ayudante,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const query = `
      INSERT INTO tarifario_viaje_especial(
        monto_cliente, 
        monto_cliente_por_ayudante,
        monto_transporte,
        monto_transporte_por_ayudante,
        fecha_creacion
      ) VALUES ($1,$2,$3,$4,$5)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [
      monto_cliente, 
      monto_cliente_por_ayudante,
      monto_transporte,
      monto_transporte_por_ayudante,
      timestamp
    ]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ 
  id,
  monto_cliente, 
  monto_cliente_por_ayudante,
  monto_transporte,
  monto_transporte_por_ayudante,
  userEmail,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const query = `
      UPDATE tarifario_viaje_especial SET
        monto_cliente=$1, 
        monto_cliente_por_ayudante=$2,
        monto_transporte=$3,
        monto_transporte_por_ayudante=$4,
        fecha_ultima_edicion=$5,
        correo_ultima_edicion=$6
      WHERE id=$7
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [
      monto_cliente, 
      monto_cliente_por_ayudante,
      monto_transporte,
      monto_transporte_por_ayudante,
      timestamp,
      userEmail,
      id
    ]);

    return result;
  } catch (error) {
    throw error;
  }
}

export const upsert = async (params) => {
  try {
    let result;
    if (params.id) {
      result = await update(params);
    } else {
      result = await create(params);
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export const softDelete = async ({ 
  id,
  userEmail,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const query = `
      UPDATE tarifario_viaje_especial SET
        activo=false, 
        fecha_ultima_edicion=$1,
        correo_ultima_edicion=$2
      WHERE id=$3
    `;

    await connection.queryWithParameters(query, [
      timestamp,
      userEmail,
      id
    ]);

    return true;
  } catch (error) {
    throw error;
  }
}

export const hardDelete = async ({ 
  id,
  connection
}) => {
  try {
    const query = `
      DELETE FROM tarifario_viaje_especial
      WHERE id=$1
    `;

    await connection.queryWithParameters(query, [id]);

    return true;
  } catch (error) {
    throw error;
  }
}