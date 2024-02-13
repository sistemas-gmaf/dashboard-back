import { FOLDER_TRANSPORTES_CONSTANCIA_AFIP } from "../configs/folderNames.js";
import { createTransaction } from "../configs/dbConnection.js";
import * as transportesService from "../services/transportes.js";
import * as msGraphService from "../services/msGraph.js";
import * as documentacionService from "../services/documentacion.js";
import { parseDatabaseError } from "../utils/parseDatabaseError.js";

/**
 * @description Obtener una o varias empresas de transportes
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {
  const { accessToken } = req.user;
  let constancia_afip_url;

  try {
    const { id } = req.params;

    const result = await transportesService.get({ id });

    if (id && result.item_id_onedrive && result.drive_id_onedrive) {
      constancia_afip_url = await msGraphService.getDownloadUrl({ 
        accessToken, 
        driveId: result.drive_id_onedrive,
        itemId: result.item_id_onedrive
      });
    }

    if (id) {
      res.json({ data: { ...result, constancia_afip_url } });
    } else {
      res.json({ data: result });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener transportes', error });
  }
}

/**
 * @description Crear nuevo registro de empresa de transporte
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const create = async (req, res) => {
  const { accessToken } = req.user;
  let connection, responseSaveFile, driveId;

  try {
    connection = await createTransaction();
    const { nombre, descripcion } = req.body;

    const idTransporte = await transportesService.create({ nombre, descripcion, connection });

    if (Boolean(req.file)) {
      const fileContent = req.file.buffer;
      const fileType = req.file.mimetype;
      const fileExtension = req.file.originalname.split('.')[1];
      const fileName = `${idTransporte}.${fileExtension}`;
      const folderName = FOLDER_TRANSPORTES_CONSTANCIA_AFIP;

      const folderResponse = await msGraphService.getFoldersSharedWithMe({ accessToken, folderName });

      const parentId = folderResponse.parentId;
      driveId = folderResponse.driveId;
  
      responseSaveFile = await msGraphService.createFileInFolder({ 
        accessToken, fileName, fileType, folderName, fileContent, driveId, parentId
      });

      await documentacionService.create({
        archivoTipo: fileType,
        tipo: 'constancia_afip',
        poseedor: 'transporte',
        poseedorId: idTransporte,
        driveId: responseSaveFile.parentReference.driveId,
        fileId: responseSaveFile.id,
        connection
      });
    }

    await connection.commit();
    res.status(201).json({ message: 'Transporte creado correctamente', idTransporte });
  } catch (error) {
    if (Boolean(responseSaveFile)) {
      msGraphService.deleteFile({ accessToken, driveId, itemId: responseSaveFile.id });
    }
    await connection?.rollback();
    res.status(parseDatabaseError(error.code) || 500).json({ message: 'Error en la creacion de un transporte', error });
  }
}

/**
 * @description Actualizar registro de transporte
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const update = async (req, res) => {
  const { accessToken } = req.user;
  const { file } = req;
  let connection, driveId, responseSaveFile;

  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const { mail: userEmail } = req.user.profile;
    connection = await createTransaction();

    const idTransporte = await transportesService.update({ id, nombre, descripcion, connection, userEmail });

    if (Boolean(file)) {
      const fileContent = file.buffer;
      const fileType = file.mimetype;
      const fileExtension = file.originalname.split('.')[1];
      const fileName = `${id}.${fileExtension}`;
      const folderName = FOLDER_TRANSPORTES_CONSTANCIA_AFIP;
      
      const folderResponse = await msGraphService.getFoldersSharedWithMe({ accessToken, folderName });
      const parentId = folderResponse.parentId;
      driveId = folderResponse.driveId;
      
      responseSaveFile = await msGraphService.updateFileInFolder({ 
        accessToken, 
        fileName,
        fileType,
        folderName,
        fileContent,
        driveId,
        parentId
      });

      await documentacionService.upsert({
        driveId,
        archivoTipo: fileType,
        tipo: 'constancia_afip',
        poseedor: 'transporte',
        poseedorId: id,
        fileId: responseSaveFile.id,
        userEmail,
        connection
      });
    }

    await connection.commit();
    res.status(201).json({ message: 'Transporte actualizado correctamente', idTransporte });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error en la actualizacion de un transporte', error });
  }
}

/**
 * @description Eliminar registro de transporte de manera logica
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const softDelete = async (req, res) => {
  let connection;

  try {
    const { id } = req.params;
    const { mail: userEmail } = req.user.profile;
    connection = await createTransaction();

    await transportesService.softDelete({ id, connection, userEmail });

    await connection.commit();
    res.status(201).json({ message: 'Transporte borrado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error en el borrado de un transporte', error });
  }
}