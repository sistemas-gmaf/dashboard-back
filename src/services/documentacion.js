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

export const update = async ({
  driveId,
  archivoTipo,
  tipo,
  poseedor,
  poseedorId,
  fileId,
  userEmail,
  connection
}) => {
  try {
    const timestamp = getTimestamp();

    const query = `
      UPDATE
        documentacion
      SET
        drive_id_onedrive=$1,
        tipo_archivo=$2,
        item_id_onedrive=$3,
        fecha_ultima_edicion=$4,
        correo_ultima_edicion=$5
      WHERE
        tipo_documentacion=$6
        AND tipo_poseedor=$7
        AND id_poseedor=$8
    `;

    await connection.queryWithParameters(query, [
      driveId, 
      archivoTipo, 
      fileId, 
      timestamp, 
      userEmail,
      tipo,
      poseedor,
      poseedorId
    ]);

    return true;
  } catch (error) {
    throw error;
  }
}