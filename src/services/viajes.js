import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id, estado }) => {
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
        vh.id as vehiculo_id,
        z.id as zona_id,
        z.descripcion AS zona,
        vj.estado,
        vj.cantidad_ayudantes,
        vj.id_tarifario_cliente,
        vj.id_tarifario_transporte_general,
        vj.id_tarifario_transporte_especial,
        vj.id_tarifario_viaje_especial
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
      LEFT JOIN transporte_vehiculo tvh
        ON tvh.id_vehiculo=vh.id
      LEFT JOIN transporte tr
        ON tr.id=tvh.id_transporte
      LEFT JOIN tarifario_cliente trcl
        ON trcl.id=vj.id_tarifario_cliente
      LEFT JOIN tarifario_transporte_general trtg
        ON trtg.id=vj.id_tarifario_transporte_general
      LEFT JOIN tarifario_transporte_especial trte
        ON trte.id=vj.id_tarifario_transporte_especial
      LEFT JOIN tarifario_viaje_especial trve
        ON trve.id=vj.id_tarifario_viaje_especial
      WHERE vj.activo=true
    `;

    let result;

    if (Boolean(id)) {
      query += ' and vj.id=$1';
      result = await dbConnection.query(query, [id]);
      result.rows = result.rows[0];
    } else if (Boolean(estado)) {
      query += ' and vj.estado=$1';
      result = await dbConnection.query(query, [estado]);
    } else {
      result = await dbConnection.query(query);
    }

    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const create = async ({ 
  id_cliente, id_vehiculo, id_zona_destino, fecha_salida, cantidad_ayudantes,
  id_tarifario_cliente, id_tarifario_transporte_general, id_tarifario_transporte_especial,
  id_tarifario_viaje_especial, estado, connection 
}) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      INSERT INTO viaje(
        id_cliente, id_vehiculo, id_zona_destino, fecha_salida, cantidad_ayudantes,
        id_tarifario_cliente, id_tarifario_transporte_general, id_tarifario_transporte_especial,
        id_tarifario_viaje_especial, estado, fecha_creacion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [
      id_cliente, id_vehiculo, id_zona_destino, fecha_salida, cantidad_ayudantes,
      id_tarifario_cliente, id_tarifario_transporte_general, id_tarifario_transporte_especial,
      id_tarifario_viaje_especial, estado, timestamp
    ]);

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

export const update = async ({
  id,
  id_cliente,
  id_vehiculo,
  id_zona_destino,
  fecha_salida,
  cantidad_ayudantes,
  estado,
  id_tarifario_cliente,
  id_tarifario_transporte_general,
  id_tarifario_transporte_especial,
  id_tarifario_viaje_especial,
  userEmail,
  connection,
}) => {
  try {
    const timestamp = getTimestamp();

    // Filtrar parámetros que no tienen valor definido
    const params = {
      id_cliente,
      id_vehiculo,
      id_zona_destino,
      fecha_salida,
      cantidad_ayudantes,
      estado,
      id_tarifario_cliente,
      id_tarifario_transporte_general,
      id_tarifario_transporte_especial,
      id_tarifario_viaje_especial,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value !== undefined)
    );

    // Añadir userEmail y timestamp a la consulta y los parámetros si están definidos
    if (userEmail !== undefined) {
      filteredParams.correo_ultima_edicion = userEmail;
    }

    if (timestamp !== undefined) {
      filteredParams.fecha_ultima_edicion = timestamp;
    }

    // Construir la consulta SQL
    let query = `
      UPDATE 
        viaje
      SET
        ${Object.keys(filteredParams)
          .map((key, index) => `${key}=$${index + 1}`)
          .join(',')}
      WHERE
        id=$${Object.keys(filteredParams).length + 1}
    `;

    // Construir el array de parámetros
    const queryParams = Object.values(filteredParams);
    queryParams.push(id);

    // Ejecutar la consulta
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
        viaje
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

export const calculateTarifaTransporte = async ({ id_vehiculo_tipo, id_zona, id_cliente, fecha_salida, id_transporte }) => {
  try {
    let query = `
      WITH TransporteTarifario AS (
          SELECT DISTINCT
              COALESCE(tte.id, ttg.id) AS tarifario_id,
              COALESCE(tte.id_vehiculo_tipo, ttg.id_vehiculo_tipo) AS id_vehiculo_tipo,
              COALESCE(tte.id_zona, ttg.id_zona) AS id_zona,
              COALESCE(tte.id_cliente, ttg.id_cliente) AS id_cliente,
              COALESCE(tte.monto, ttg.monto) AS monto,
              COALESCE(tte.monto_por_ayudante, ttg.monto_por_ayudante) AS monto_por_ayudante,
              COALESCE(tte.fecha_desde, ttg.fecha_desde) AS fecha_desde,
              COALESCE(tte.fecha_hasta, ttg.fecha_hasta) AS fecha_hasta,
              CASE WHEN tte.id IS NOT NULL THEN 'Transporte Especial' ELSE 'Transporte General' END AS tipo_tarifario
          FROM transporte t
          LEFT JOIN tarifario_transporte_especial tte
              ON tte.id_transporte = $5
              AND tte.id_vehiculo_tipo = $1
              AND tte.id_zona = $2
              AND tte.id_cliente = $3
              AND TO_CHAR(tte.fecha_desde, 'YYYYMMDD') <= $4
              AND COALESCE(TO_CHAR(tte.fecha_hasta, 'YYYYMMDD'), $4) >= $4
              AND tte.activo=TRUE
          LEFT JOIN tarifario_transporte_general ttg
              ON ttg.id_vehiculo_tipo = $1
              AND ttg.id_zona = $2
              AND ttg.id_cliente = $3
              AND TO_CHAR(ttg.fecha_desde, 'YYYYMMDD') <= $4
              AND COALESCE(TO_CHAR(ttg.fecha_hasta, 'YYYYMMDD'), $4) >= $4
              AND ttg.activo=TRUE
      )
      SELECT * FROM TransporteTarifario
    `;

    const result = await dbConnection.query(query, [id_vehiculo_tipo, id_zona, id_cliente, fecha_salida, id_transporte]);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const calculateTarifaCliente = async ({ id_vehiculo_tipo, id_zona, id_cliente, fecha_salida }) => {
  try {
    let query = `
      SELECT
          tc.id AS tarifario_id,
          tc.id_vehiculo_tipo,
          tc.id_zona,
          tc.id_cliente,
          tc.monto,
          tc.monto_por_ayudante,
          tc.fecha_desde,
          tc.fecha_hasta,
          'Cliente' AS tipo_tarifario
      FROM tarifario_cliente tc
      WHERE tc.id_vehiculo_tipo = $1
          AND tc.id_zona = $2
          AND tc.id_cliente = $3
          AND TO_CHAR(tc.fecha_desde, 'YYYYMMDD') <= $4
          AND COALESCE(TO_CHAR(tc.fecha_hasta, 'YYYYMMDD'), $4) >= $4;    
          AND tc.activo=true
    `;

    const result = await dbConnection.query(query, [id_vehiculo_tipo, id_zona, id_cliente, fecha_salida]);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const getTarifarios= async ({ id_tarifario_cliente, id_tarifario_transporte_general, id_tarifario_transporte_especial, id_tarifario_viaje_especial }) => {
  try {
    const queryCliente = `SELECT * FROM tarifario_cliente WHERE id=$1`;
    const queryTransporteGeneral = `SELECT * FROM tarifario_transporte_general WHERE id=$1`;
    const queryTransporteEspecial = `SELECT * FROM tarifario_transporte_especial WHERE id=$1`;
    const queryViajeEspecial = `SELECT * FROM tarifario_viaje_especial WHERE id=$1`;

    const resultCliente = await dbConnection.query(queryCliente, [id_tarifario_cliente]);
    const resultTransporteGeneral = await dbConnection.query(queryTransporteGeneral, [id_tarifario_transporte_general]);
    const resultTransporteEspecial = await dbConnection.query(queryTransporteEspecial, [id_tarifario_transporte_especial]);
    const resultViajeEspecial = await dbConnection.query(queryViajeEspecial, [id_tarifario_viaje_especial]);

    return [
      resultCliente.rows[0],
      resultTransporteGeneral.rows[0] || resultTransporteEspecial.rows[0],
      resultViajeEspecial.rows[0],
    ];
  } catch (error) {
    throw error;
  }
}

export const getEspecial = async ({ id }) => {
  try {
    let query = `
      SELECT 
        vj.id,
        vj.id as id_viaje,

        tve.monto_cliente,
        to_char(tve.monto_cliente, '$999,999,999.99') AS monto_cliente_formateado,

        tve.monto_cliente_por_ayudante,
        to_char(tve.monto_cliente_por_ayudante, '$999,999,999.99') AS monto_cliente_por_ayudante_formateado,

        tve.monto_transporte,
        to_char(tve.monto_transporte, '$999,999,999.99') AS monto_transporte_formateado,

        tve.monto_transporte_por_ayudante,
        to_char(tve.monto_transporte_por_ayudante, '$999,999,999.99') AS monto_transporte_por_ayudante_formateado,

        tve.fecha_creacion,
        vj.fecha_salida,
        TO_CHAR(TO_DATE(vj.fecha_salida, 'YYYYMMDD'), 'DD/MM/YYYY') AS fecha_salida_formateada,
        ch.nombre AS chofer,
        vht.descripcion AS vehiculo_tipo,
        z.descripcion AS zona,
        cl.abreviacion_razon_social AS cliente,
        tr.nombre as transporte,
        vj.correo_ultima_edicion AS viaje_correo_ultima_edicion,
        vj.cantidad_ayudantes
      FROM
        viaje vj
      INNER JOIN tarifario_viaje_especial tve
        ON tve.id=vj.id_tarifario_viaje_especial
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

export const createViajeRemito = async ({
  numero, id_viaje, observaciones, connection
}) => {
  try {
    const timestamp = getTimestamp();
    const queryRemito = `
      INSERT INTO viaje_remito (numero, id_viaje, fecha_creacion) 
      VALUES($1, $2, $3)
      RETURNING id
    `;

    const queryRemitoObservacion = `
      INSERT INTO viaje_remito_observacion (id_viaje_remito, observacion, fecha_creacion)
      VALUES($1, $2, $3)
    `;

    const resultViajeRemito = await connection.queryWithParameters(queryRemito, [
      numero, id_viaje, timestamp
    ]);

    const idViajeRemito = resultViajeRemito.rows[0].id;

    const insertObservaciones = observaciones.map(observacion => 
      connection.queryWithParameters(queryRemitoObservacion, [idViajeRemito, observacion, timestamp])  
    );

    await Promise.all(insertObservaciones);

    return true;
  } catch (error) {
    throw error;
  }
}

export const updateViajeRemito = async ({
  numero, id_viaje, observaciones, userEmail, connection
}) => {
  try {
    const timestamp = getTimestamp();
    const queryRemito = `
      UPDATE viaje_remito SET 
      numero=$1, fecha_ultima_edicion=$2, correo_ultima_edicion=$3 
      WHERE id_viaje=$4
      RETURNING id
    `;

    const queryInsertRemitoObservacion = `
      INSERT INTO viaje_remito_observacion (id_viaje_remito, observacion, fecha_creacion)
      VALUES($1, $2, $3)
    `;

    const queryUpdateRemitoObservacion = `
      UPDATE viaje_remito_observacion 
      SET observacion=$1, fecha_ultima_edicion=$2, correo_ultima_edicion=$3, activo=$4
      WHERE id=$5
    `;

    const resultViajeRemito = await connection.queryWithParameters(queryRemito, [
      numero, timestamp, userEmail, id_viaje
    ]);

    const idViajeRemito = resultViajeRemito.rows[0].id;

    const insertObservaciones = observaciones.map(observacion => {
      const { observacion: texto, activo, id } = observacion;
      if (id) {
        return connection.queryWithParameters(queryUpdateRemitoObservacion, [
          texto, timestamp, userEmail, activo, id
        ])
      } else {
        return connection.queryWithParameters(queryInsertRemitoObservacion, [idViajeRemito, texto, timestamp])  
      }
    });

    await Promise.all(insertObservaciones);

    return true;
  } catch (error) {
    throw error;
  }
}

export const getTarifasByViajeId = async (id) => {
  try {
    const query = `
      SELECT 
        COALESCE(tve.monto_cliente, tc.monto) AS cliente_monto,
        COALESCE(tve.monto_cliente_por_ayudante, tc.monto_por_ayudante) AS cliente_monto_por_ayudante,
        COALESCE(tve.monto_transporte, tte.monto, ttg.monto) AS transporte_monto,
        COALESCE(tve.monto_transporte_por_ayudante, tte.monto_por_ayudante, ttg.monto_por_ayudante) AS transporte_monto_por_ayudante
      FROM viaje vj
        LEFT JOIN tarifario_cliente tc
          ON vj.id_tarifario_cliente=tc.id
        LEFT JOIN tarifario_transporte_general ttg
          ON vj.id_tarifario_transporte_general=ttg.id
        LEFT JOIN tarifario_transporte_especial tte
          ON vj.id_tarifario_transporte_especial=tte.id
        LEFT JOIN tarifario_viaje_especial tve
          ON vj.id_tarifario_viaje_especial=tve.id
      WHERE vj.id=$1
    `;

    const result = await dbConnection.query(query, [id]);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const getRemitoByViajeId = async (id) => {
  try {
    const queryRemito = `SELECT * FROM viaje_remito WHERE id_viaje=$1`;
    const queryObservaciones = `SELECT * FROM viaje_remito_observacion WHERE id_viaje_remito=$1 and activo=true`;

    const resultRemito = await dbConnection.query(queryRemito, [id]);
    const idRemito = resultRemito.rows[0].id;

    const resultObservaciones = await dbConnection.query(queryObservaciones, [idRemito]);
    
    return {
      ...resultRemito.rows[0],
      observaciones: resultObservaciones.rows
    };
  } catch (error) {
    throw error;
  }
}

export const updateEspecial = async ({
  id_viaje,
  id_tarifario_viaje_especial,
  monto_cliente,
  monto_cliente_por_ayudante,
  monto_transporte,
  monto_transporte_por_ayudante,
  cantidad_ayudantes,
  estado,
  userEmail,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const queryUpdateViaje = `
      UPDATE viaje 
      SET estado=$1, fecha_ultima_edicion=$2, 
      correo_ultima_edicion=$3, cantidad_ayudantes=$5
      WHERE id=$4 
    `;

    const queryUpdateTarifarioEspecial = `
      UPDATE tarifario_viaje_especial
      SET monto_cliente=$1, monto_cliente_por_ayudante=$2, 
        monto_transporte=$3, monto_transporte_por_ayudante=$4,
        fecha_ultima_edicion=$5, correo_ultima_edicion=$6
      WHERE id=$7  
    `;

    await connection.queryWithParameters(queryUpdateViaje, [
      estado, timestamp, userEmail, id_viaje, cantidad_ayudantes
    ]);

    await connection.queryWithParameters(queryUpdateTarifarioEspecial, [
      monto_cliente, monto_cliente_por_ayudante, monto_transporte, monto_transporte_por_ayudante,
      timestamp, userEmail, id_tarifario_viaje_especial
    ]);

    return true;
  } catch (error) {
    throw error;
  }
}