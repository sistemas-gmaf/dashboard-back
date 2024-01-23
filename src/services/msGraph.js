import * as graph from '@microsoft/microsoft-graph-client';

export const getUserProfile = async ({ accessToken }) => {
  try {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
  
    // Puede usar el cliente de Microsoft Graph para hacer llamadas a la API de Microsoft Graph
    const response = await client.api('/me').get();
    
    return response;
  } catch (error) {
    throw new Error('Error al obtener el perfil de usuario');
  }
}

export const getFoldersSharedWithMe = async ({ accessToken, folderName }) => {
  try {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
  
    // Puede usar el cliente de Microsoft Graph para hacer llamadas a la API de Microsoft Graph
    const response = await client.api('/me/drive/sharedWithMe').get();

    // Obtener tus propias carpetas (sirve para el caso de login con la cuenta sistemas)
    const myDriveResponse = await client.api('/me/drive/root/children').get();

    const selectedFolder = [...response.value, ...myDriveResponse.value]
      .find(fldr => fldr.name === folderName);
    const parentId = selectedFolder?.remoteItem?.id || selectedFolder?.id;
    const driveId = selectedFolder?.remoteItem?.parentReference?.driveId || selectedFolder?.parentReference?.driveId;
    
    return {
      parentId,
      driveId
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Por si se necesita modificar la funcion de actualizar o crear archivos se deja en funciones separadas
 */
export const createFileInFolder = async ({ 
  accessToken, 
  fileName,
  driveId, 
  fileContent, 
  parentId 
}) => {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  try {
    const response = await client.api(`/drives/${driveId}/items/${parentId}:/${fileName}:/content`)
      .put(fileContent);

    return response;
  } catch (error) {
    throw error;
  }
}

export const updateFileInFolder = async ({ 
  accessToken, 
  fileName,
  driveId, 
  fileContent, 
  parentId 
}) => {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  try {
    const response = await client.api(`/drives/${driveId}/items/${parentId}:/${fileName}:/content`)
      .put(fileContent);
  
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteFile = async ({ accessToken, driveId, itemId }) => {
  try {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
    
    const response = await client.api(`/drives/${driveId}/items/${itemId}`)
      .delete();

    return response;
  } catch (error) {
    throw error;
  }
}

export const getDownloadUrl = async ({ accessToken, driveId, itemId }) => {
  try {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const response = await client.api(`/drives/${driveId}/items/${itemId}`)
      .get();

    return response['@microsoft.graph.downloadUrl'];
  } catch (error) {
    return null;
  }
}