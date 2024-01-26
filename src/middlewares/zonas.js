import { createTransaction } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const upsertZona = async (req, res, next) => {
  const { connection: previousConnection } = req.body;
  let connection;
  try {
    connection = previousConnection || await createTransaction();
    const timestamp = getTimestamp();

    const query = `
      WITH ins AS (
        INSERT INTO zona (descripcion, fecha_creacion)
        VALUES (UPPER(TRIM($1)), $2)
        ON CONFLICT (descripcion) DO NOTHING
        RETURNING id
      )
      SELECT id FROM ins
      UNION ALL
      SELECT id FROM zona
      WHERE descripcion = UPPER(TRIM($1))
    `;

    const result = await connection.queryWithParameters(query, [req.body.zona, timestamp]);

    req.body.zona = result.rows[0].id;
    req.body.connection = connection;

    next();
  } catch (error) {
    connection?.rollback();
    res.status(500).json({ message: 'Error al crear/obtener zona', error: error.message });
  }
}