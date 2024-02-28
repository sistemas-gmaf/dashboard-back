import { dbConnection } from "../configs/dbConnection.js";

export const get = async () => {
  try {
    const query = `
      SELECT 
          (SELECT COUNT(*) FROM viaje WHERE activo=TRUE AND estado='PENDIENTE') AS viajes_pendientes,
          (SELECT COALESCE(SUM(importe), 0) AS total_importe
            FROM compromiso WHERE TO_DATE(fecha, 'YYYYMMDD') < CURRENT_DATE - EXTRACT(DAY FROM CURRENT_DATE)::INTEGER + 1 
            AND estado='PENDIENTE' AND activo=true) AS compromisos_pendientes,
          (SELECT COALESCE(SUM(importe), 0) AS total_importe
            FROM cheque WHERE TO_DATE(fecha_pago, 'YYYYMMDD') < CURRENT_DATE - EXTRACT(DAY FROM CURRENT_DATE)::INTEGER + 1 
            AND estado='PENDIENTE' AND activo=true) AS cheques_pendientes,
          t1.*,
          t1.ventas - t1.compras AS ganancia,
          (SELECT COUNT(*) FROM viaje WHERE activo=true AND fecha_salida >= TO_CHAR(DATE_TRUNC('MONTH', CURRENT_DATE), 'YYYYMMDD') AND fecha_salida <= TO_CHAR((DATE_TRUNC('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH - 1 day'), 'YYYYMMDD')) AS viajes,
          (SELECT COUNT(DISTINCT id_vehiculo) FROM viaje WHERE activo=true AND fecha_salida >= TO_CHAR(DATE_TRUNC('MONTH', CURRENT_DATE), 'YYYYMMDD') AND fecha_salida <= TO_CHAR((DATE_TRUNC('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH - 1 day'), 'YYYYMMDD')) AS vehiculos
      FROM (
          SELECT 
              SUM(COALESCE(tve.monto_cliente, tc.monto)) +
              SUM(COALESCE(tve.monto_cliente_por_ayudante, tc.monto_por_ayudante) * vj.cantidad_ayudantes) AS ventas,
              SUM(COALESCE(tve.monto_transporte, tte.monto, ttg.monto)) +
              SUM(COALESCE(tve.monto_transporte_por_ayudante, tte.monto_por_ayudante, ttg.monto_por_ayudante) * vj.cantidad_ayudantes) AS compras
          FROM viaje vj
              LEFT JOIN tarifario_cliente tc ON vj.id_tarifario_cliente=tc.id
              LEFT JOIN tarifario_transporte_general ttg ON vj.id_tarifario_transporte_general=ttg.id
              LEFT JOIN tarifario_transporte_especial tte ON vj.id_tarifario_transporte_especial=tte.id
              LEFT JOIN tarifario_viaje_especial tve ON vj.id_tarifario_viaje_especial=tve.id
          WHERE vj.activo=true
          AND fecha_salida >= TO_CHAR(DATE_TRUNC('MONTH', CURRENT_DATE), 'YYYYMMDD')
          AND fecha_salida <= TO_CHAR((DATE_TRUNC('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH - 1 day'), 'YYYYMMDD')
      ) t1
    `;

    const result = await dbConnection.query(query);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}