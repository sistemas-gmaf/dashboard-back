import { dbConnection } from "../configs/dbConnection.js"

export const validateNewTarifarioCliente = async (req, res, next) => {  
  try {
    const { cliente, vehiculo_tipo, zona, fecha_desde, sobreescribir_tarifario } = req.body;

    const query = `
      SELECT *
      FROM tarifario_cliente
      WHERE activo=TRUE 
        AND id_cliente=$1
        AND id_vehiculo_tipo=$2 
        AND id_zona=$3
        AND (TO_CHAR(fecha_desde, 'YYYYMMDD') > $4) 
    `;

    const result = await dbConnection.query(query, [cliente, vehiculo_tipo, zona, fecha_desde]);

    if (result.rows.length > 0) {
      return res.status(400).json({ 
        message: 'No se pueden crear historicos de tarifarios'
      })
    }

    if (!sobreescribir_tarifario) {
      const query = `
        SELECT *
        FROM tarifario_cliente
        WHERE activo=TRUE 
          AND id_cliente=$1
          AND id_vehiculo_tipo=$2 
          AND id_zona=$3
          AND (TO_CHAR(fecha_hasta, 'YYYYMMDD') >= $4 OR fecha_hasta IS NULL) 
      `;
  
      const result = await dbConnection.query(query, [cliente, vehiculo_tipo, zona, fecha_desde]);

      if (result.rows.length > 0) {
        return res.status(409).json({ 
          message: 'Hay un tarifario que esta en vigencia', 
          data: result.rows[0]
        })
      }
    }

    next();

  } catch (err) {
    res.status(err?.statusCode || 500).json({ message: 'Error al validar tarifario de cliente', error: err.message });
  }
}

export const validateNewTarifarioTransporte = async (req, res, next) => {  
  try {
    const { vehiculo_tipo, zona, fecha_desde, sobreescribir_tarifario } = req.body;

    const query = `
      SELECT *
      FROM tarifario_transporte_general
      WHERE activo=TRUE 
        AND id_vehiculo_tipo=$1
        AND id_zona=$2
        AND (TO_CHAR(fecha_desde, 'YYYYMMDD') > $3) 
    `;

    const result = await dbConnection.query(query, [vehiculo_tipo, zona, fecha_desde]);

    if (result.rows.length > 0) {
      return res.status(400).json({ 
        message: 'No se pueden crear historicos de tarifarios'
      })
    }

    if (!sobreescribir_tarifario) {
      const query = `
        SELECT *
        FROM tarifario_transporte_general
        WHERE activo=TRUE 
          AND id_vehiculo_tipo=$1
          AND id_zona=$2
          AND (TO_CHAR(fecha_hasta, 'YYYYMMDD') >= $3 OR fecha_hasta IS NULL) 
      `;
  
      const result = await dbConnection.query(query, [vehiculo_tipo, zona, fecha_desde]);

      if (result.rows.length > 0) {
        return res.status(409).json({ 
          message: 'Hay un tarifario que esta en vigencia', 
          data: result.rows[0]
        })
      }
    }

    next();

  } catch (err) {
    res.status(err?.statusCode || 500).json({ message: 'Error al validar tarifario transporte general', error: err.message });
  }
}

export const validateNewTarifarioTransporteEspecial = async (req, res, next) => {  
  try {
    const { transporte, vehiculo_tipo, zona, fecha_desde, sobreescribir_tarifario } = req.body;

    const query = `
      SELECT *
      FROM tarifario_transporte_especial
      WHERE activo=TRUE 
        AND id_transporte=$1
        AND id_vehiculo_tipo=$2 
        AND id_zona=$3
        AND (TO_CHAR(fecha_desde, 'YYYYMMDD') > $4) 
    `;

    const result = await dbConnection.query(query, [transporte, vehiculo_tipo, zona, fecha_desde]);

    if (result.rows.length > 0) {
      return res.status(400).json({ 
        message: 'No se pueden crear historicos de tarifarios'
      })
    }

    if (!sobreescribir_tarifario) {
      const query = `
        SELECT *
        FROM tarifario_transporte_especial
        WHERE activo=TRUE 
          AND id_transporte=$1
          AND id_vehiculo_tipo=$2 
          AND id_zona=$3
          AND (TO_CHAR(fecha_hasta, 'YYYYMMDD') >= $4 OR fecha_hasta IS NULL) 
      `;
  
      const result = await dbConnection.query(query, [transporte, vehiculo_tipo, zona, fecha_desde]);

      if (result.rows.length > 0) {
        return res.status(409).json({ 
          message: 'Hay un tarifario que esta en vigencia', 
          data: result.rows[0]
        })
      }
    }

    next();

  } catch (err) {
    res.status(err?.statusCode || 500).json({ message: 'Error al validar tarifario de transporte especial', error: err.message });
  }
}
