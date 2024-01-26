import * as msGraphService from "../services/msGraph.js";
import * as vehiculosService from "../services/vehiculos.js";
import * as documentacionService from '../services/documentacion.js';
import { FOLDER_VEHICULOS_VTV } from '../configs/folderNames.js';
import { createTransaction } from "../configs/dbConnection.js";

/**
 * @description Obtiene uno o varios vehiculos
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {
  const { accessToken } = req.user;
  let vtv_url = null;

  try {
    const { id } = req.params;

    const result = await vehiculosService.get({ id });

    if (id && result.item_id_onedrive && result.drive_id_onedrive) {
      vtv_url = await msGraphService.getDownloadUrl({ 
        accessToken, 
        driveId: result.drive_id_onedrive,
        itemId: result.item_id_onedrive
      });
    }

    if (id) {
      res.json({ data: { ...result, vtv_url } });
    } else {
      res.json({ data: result });
    }
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener vehiculos', error });
  }
}

/**
 * @description Crear un vehiculo
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const create = async (req, res) => {
  const { accessToken } = req.user;
  const { connection } = req.body;
  
  let vehiculoId;
  let driveId;
  let responseSaveFile;

  try {
    const { 
      chofer, patente, transporte, vehiculo_tipo 
    } = req.body;

    vehiculoId = await vehiculosService.create({ 
      chofer, patente, transporte, vehiculo_tipo, connection
    });
    
    if (Boolean(req.file)) {
      const fileContent = req.file.buffer;
      const fileType = req.file.mimetype;
      const fileExtension = req.file.originalname.split('.')[1];
      const fileName = `${vehiculoId}.${fileExtension}`;
      const folderName = FOLDER_VEHICULOS_VTV;
      
      const folderResponse = await msGraphService.getFoldersSharedWithMe({ accessToken, folderName });

      const parentId = folderResponse.parentId;
      driveId = folderResponse.driveId;
  
      responseSaveFile = await msGraphService.createFileInFolder({ 
        accessToken, fileName, fileType, folderName, fileContent, driveId, parentId
      });

      await documentacionService.create({
        archivoTipo: fileType,
        tipo: 'vtv',
        poseedor: 'vehiculo',
        poseedorId: vehiculoId,
        driveId: responseSaveFile.parentReference.driveId,
        fileId: responseSaveFile.id,
        connection
      });
    }

    await connection?.commit();
    res.status(201).json({ message: 'Vehículo creado exitosamente' });
  } catch (error) {
    if (Boolean(responseSaveFile)) {
      await msGraphService.deleteFile({ accessToken, driveId, itemId: responseSaveFile.id });
    }
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear vehiculo', error });
  }
}

/**
 * @description Actualiza un vehiculo
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const update = async (req, res) => {
  const { accessToken } = req.user;
  const { connection } = req.body;

  let driveId;
  let responseSaveFile;
  
  try {
    const { id } = req.body;
    const { mail: userEmail } = req.user.profile;
    const { patente, vehiculo_tipo } = req.body;
    const { file } = req;

    await vehiculosService.update({ 
      id, 
      patente, 
      vehiculo_tipo, 
      userEmail, 
      connection 
    });

    if (Boolean(file)) {
      const fileContent = file.buffer;
      const fileType = file.mimetype;
      const fileExtension = file.originalname.split('.')[1];
      const fileName = `${id}.${fileExtension}`;
      const folderName = FOLDER_VEHICULOS_VTV;
      
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
        tipo: 'vtv',
        poseedor: 'vehiculo',
        poseedorId: id,
        fileId: responseSaveFile.id,
        userEmail,
        connection
      });
    }

    await connection.commit();
    res.status(200).json({ message: 'Vehiculo actualizado correctamente', responseSaveFile });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar vehiculo', error });
  }
}

/**
 * @description Borrado a nivel logico de un vehiculo
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const softDelete = async (req, res) => {
  const { mail: userEmail } = req.user.profile;
  let connection;

  try {
    connection = await createTransaction();
    const { id } = req.params;

    vehiculosService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'Vehiculo borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar vehiculo', error });
  }
}

/**
 * @description Obtiene los tipos de vehiculos
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const getTipos = async (req, res) => {
  try {
    const result = await vehiculosService.getTipos();

    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tipos de vehiculos', error });
  }
}