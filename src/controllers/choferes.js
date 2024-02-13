import { createTransaction } from "../configs/dbConnection.js";
import * as choferesService from "../services/choferes.js";
import * as msGraphService from "../services/msGraph.js";
import * as documentacionService from '../services/documentacion.js';
import { getFileDownloadLink } from "../utils/getFileDownloadLink.js";
import { 
  FOLDER_CHOFERES_DNI_DORSO, 
  FOLDER_CHOFERES_DNI_FRENTE, 
  FOLDER_CHOFERES_LICENCIA_CONDUCIR_FRENTE, 
  FOLDER_CHOFERES_LICENCIA_CONDUCIR_DORSO, 
  FOLDER_CHOFERES_SEGURO_VEHICULO, 
  FOLDER_CHOFERES_SEGURO_VIDA 
} from "../configs/folderNames.js";
import { parseDatabaseError } from "../utils/parseDatabaseError.js";

const mapFileNameToFolderName = {
  dni_frente: FOLDER_CHOFERES_DNI_FRENTE,
  dni_dorso: FOLDER_CHOFERES_DNI_DORSO,
  licencia_conducir_frente: FOLDER_CHOFERES_LICENCIA_CONDUCIR_FRENTE,
  licencia_conducir_dorso: FOLDER_CHOFERES_LICENCIA_CONDUCIR_DORSO,
  seguro_vehiculo: FOLDER_CHOFERES_SEGURO_VEHICULO,
  seguro_vida: FOLDER_CHOFERES_SEGURO_VIDA,
};

export const get = async (req, res) => {
  const { accessToken } = req.user;
  const { id } = req.params;
  try {
    const result = await choferesService.get({ id });

    if (id) {
      const links = await getDocumentacionLinks({ accessToken, result });

      res.json({ data: { ...result, ...links }});
    } else {
      res.json({ data: result });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener choferes', error });
  }
}

export const create = async (req, res) => {
  const { accessToken } = req.user;
  let responseSaveFiles = [];
  let connection;

  try {
    connection = await createTransaction();

    const {
      nombre, dni, celular, correo
    } = req.body;

    const idChofer = await choferesService.create({ 
      nombre, dni, celular, correo, connection 
    });

    const fileNames = Object.keys(req.files);
    if (fileNames.length > 0) {
      const createFiles = fileNames.map(fileName => {
        const file = req.files[fileName][0];
        
        return async () => await createFile({ 
          folderName: mapFileNameToFolderName[fileName],
          type: fileName,
          id: idChofer, 
          accessToken, 
          connection,
          file,
        })
      });

      responseSaveFiles = await Promise.all(createFiles.map(func => func()));
    }

    await connection.commit();
    res.json({ message: 'Creado exitosamente' });
  } catch (error) {
    if (responseSaveFiles.length > 0) {
      const deleteFiles = responseSaveFiles.map(responseSaveFile => {
        return async () => await msGraphService.deleteFile({ 
          accessToken, 
          driveId: responseSaveFile.driveId, 
          itemId: responseSaveFile.id 
        });
      });

      await Promise.all(deleteFiles.map(func => func()));
    }
    await connection?.rollback();
    res.status(parseDatabaseError(error.code) || 500).json({ message: 'Error al crear chofer', error });
  }
}

export const update = async (req, res) => {
  const { mail: userEmail } = req.user.profile;
  const { accessToken } = req.user;
  let responseSaveFiles = [];
  const { id } = req.params;
  let connection;

  try {
    connection = await createTransaction();

    const {
      nombre, dni, celular, correo
    } = req.body;

    await choferesService.update({ 
      id, nombre, dni, celular, correo, userEmail, connection 
    });

    const fileNames = Object.keys(req.files);
    if (fileNames.length > 0) {
      const createFiles = fileNames.map(fileName => {
        const file = req.files[fileName][0];
        
        return async () => await createFile({ 
          folderName: mapFileNameToFolderName[fileName],
          type: fileName,
          accessToken, 
          connection,
          file,
          id, 
        })
      });

      responseSaveFiles = await Promise.all(createFiles.map(func => func()));
    }

    await connection.commit();
    res.json({ message: 'Actualizado exitosamente' });
  } catch (error) {
    if (responseSaveFiles.length > 0) {
      const deleteFiles = responseSaveFiles.map(responseSaveFile => {
        return async () => await msGraphService.deleteFile({ 
          accessToken, 
          driveId: responseSaveFile.driveId, 
          itemId: responseSaveFile.id 
        });
      });

      await Promise.all(deleteFiles.map(func => func()));
    }
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar chofer', error });
  }
}

export const softDelete = async (req, res) => {
  const { mail: userEmail } = req.user.profile;
  let connection;

  try {
    connection = await createTransaction();
    const { id } = req.params;

    choferesService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'Chofer borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar chofer', error });
  }
}

const getDocumentacionLinks = async ({ accessToken, result }) => {
  const {
    dni_frente_drive_id, dni_frente_item_id,
    dni_dorso_drive_id, dni_dorso_item_id,
    licencia_conducir_frente_drive_id, licencia_conducir_frente_item_id,
    licencia_conducir_dorso_drive_id, licencia_conducir_dorso_item_id,
    seguro_vehiculo_drive_id, seguro_vehiculo_item_id,
    seguro_vida_drive_id, seguro_vida_item_id
  } = result;

  const getDNIFrenteUrl = async () => await getFileDownloadLink({ 
    accessToken, driveId: dni_frente_drive_id, itemId: dni_frente_item_id 
  });
  const getDNIDorsoUrl = async () => await getFileDownloadLink({ 
    accessToken, driveId: dni_dorso_drive_id, itemId: dni_dorso_item_id 
  });
  const getLicenciaConducirFrenteUrl = async () => await getFileDownloadLink({ 
    accessToken, driveId: licencia_conducir_frente_drive_id, itemId: licencia_conducir_frente_item_id 
  });
  const getLicenciaConducirDorsoUrl = async () => await getFileDownloadLink({ 
    accessToken, driveId: licencia_conducir_dorso_drive_id, itemId: licencia_conducir_dorso_item_id 
  });
  const getSeguroVehiculoUrl = async () => await getFileDownloadLink({ 
    accessToken, driveId: seguro_vehiculo_drive_id, itemId: seguro_vehiculo_item_id 
  });
  const getSeguroVidaUrl = async () => await getFileDownloadLink({ 
    accessToken, driveId: seguro_vida_drive_id, itemId: seguro_vida_item_id 
  });

  const links = await Promise.all([
    getDNIFrenteUrl(),
    getDNIDorsoUrl(),
    getLicenciaConducirFrenteUrl(),
    getLicenciaConducirDorsoUrl(),
    getSeguroVehiculoUrl(),
    getSeguroVidaUrl()
  ]);

  return {
    dni_frente_url: links[0] || null,
    dni_dorso_url: links[1] || null,
    licencia_conducir_frente_url: links[2] || null,
    licencia_conducir_dorso_url: links[3] || null,
    seguro_vehiculo_url: links[4] || null,
    seguro_vida_url: links[5] || null,
  };
}

const createFile = async ({ accessToken, file, folderName, id, type, connection }) => {
  let responseSaveFile;

  const fileContent = file.buffer;
  const fileType = file.mimetype;
  const fileExtension = file.originalname.split('.')[1];
  const fileName = `${id}.${fileExtension}`;
  
  const folderResponse = await msGraphService.getFoldersSharedWithMe({ accessToken, folderName });

  const parentId = folderResponse.parentId;
  const driveId = folderResponse.driveId;

  responseSaveFile = await msGraphService.createFileInFolder({ 
    accessToken, fileName, fileType, folderName, fileContent, driveId, parentId
  });

  await documentacionService.create({
    archivoTipo: fileType,
    tipo: type,
    poseedor: 'chofer',
    poseedorId: id,
    driveId: responseSaveFile.parentReference.driveId,
    fileId: responseSaveFile.id,
    connection
  });

  return { ...responseSaveFile, driveId };
}