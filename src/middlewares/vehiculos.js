import { createTransaction } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const upsertVehiculoTipo = async (req, res, next) => {
  let connection;
  try {
    connection = await createTransaction();
    const timestamp = getTimestamp();

    const query = `
      WITH ins AS (
        INSERT INTO vehiculo_tipo (descripcion, fecha_creacion)
        VALUES (UPPER(TRIM($1)), $2)
        ON CONFLICT (descripcion) DO NOTHING
        RETURNING id
      )
      SELECT id FROM ins
      UNION ALL
      SELECT id FROM vehiculo_tipo
      WHERE descripcion = UPPER(TRIM($1))
    `;

    const result = await connection.queryWithParameters(query, [req.body.vehiculo_tipo, timestamp]);

    req.body.vehiculo_tipo = result.rows[0].id;
    req.body.connection = connection;

    next();
  } catch (error) {
    connection?.rollback();
    res.status(500).json({ message: 'Error al crear/obtener vehiculo_tipo', error: error.message });
  }
}