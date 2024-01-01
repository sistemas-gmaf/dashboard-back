import { getTimestamp } from "../utils/time.js";

export const create = async ({ archivoTipo, tipo, poseedor, poseedorId, driveId, fileId, connection }) => {

  try {
    const timestamp = getTimestamp();
    
    const queryInsertDocumentacion = `INSERT INTO documentacion (
      tipo_poseedor, 
      id_poseedor, 
      tipo_documentacion,
      drive_id_onedrive,
      tipo_archivo,
      item_id_onedrive,
      fecha_creacion,
      activo
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,true
    ) RETURNING id`;
    const resultInsertDocumentacion = await connection.queryWithParameters(queryInsertDocumentacion, [
      poseedor, poseedorId, tipo, driveId, archivoTipo, fileId, timestamp
    ]);
    const documentacionId = resultInsertDocumentacion.rows[0].id;

    return documentacionId;
  } catch (error) {
    throw error;
  }
}

export const upsert = async ({
  archivoTipo,
  tipo,
  poseedor,
  poseedorId,
  driveId,
  fileId,
  userEmail,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const queryUpsert = `
      INSERT INTO documentacion (
        tipo_poseedor, 
        id_poseedor, 
        tipo_documentacion,
        drive_id_onedrive,
        tipo_archivo,
        item_id_onedrive,
        fecha_creacion,
        activo
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, true
      )
      ON CONFLICT (tipo_documentacion, tipo_poseedor, id_poseedor) 
      DO UPDATE SET
        drive_id_onedrive = $8,
        tipo_archivo = $9,
        item_id_onedrive = $10,
        fecha_ultima_edicion = $11,
        correo_ultima_edicion = $12
      RETURNING id;
    `;

    const resultUpsert = await connection.queryWithParameters(queryUpsert, [
      poseedor, poseedorId, tipo, driveId, archivoTipo, fileId, timestamp,
      driveId, archivoTipo, fileId, timestamp, userEmail
    ]);

    const documentacionId = resultUpsert.rows[0].id;

    return documentacionId;
  } catch (error) {
    throw error;
  }
};
