import * as graph from '@microsoft/microsoft-graph-client';
import streamifier from 'streamifier';

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

export const getFoldersSharedWithMe = async ({ accessToken }) => {
  try {
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
  
    // Puede usar el cliente de Microsoft Graph para hacer llamadas a la API de Microsoft Graph
    const response = await client.api('/me/drive/sharedWithMe').get();
    
    return response;
  } catch (error) {
    throw error;
  }
}

export const createFileInFolder = async ({ 
  accessToken, 
  fileName, 
  fileType,
  driveId, 
  fileContent, 
  parentId 
}) => {
  let fileId;
  let shareResponse;

  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  try {
    const response = await client.api(`/drives/${driveId}/items/${parentId}:/${fileName}:/content`)
      .put(fileContent);
    
    // Obtener el ID del archivo recién creado
    fileId = response.id;

    //Si no es una imagen sera un embed
    if (!fileType.includes('image')) {
      // Compartir el archivo y obtener el enlace de uso compartido
      shareResponse = await client.api(`/drives/${driveId}/items/${fileId}/createLink`)
        .post({
          type: 'embed', // Puedes cambiar a 'view' o a 'edit' si deseas permisos de edición
        });
    } else {
      // Compartir el archivo y obtener el enlace de uso compartido
      shareResponse = await client.api(`/drives/${driveId}/items/${fileId}/createLink`)
        .post({
          type: 'view', // Puedes cambiar a 'view' o a 'edit' si deseas permisos de edición
        });
    }

    const publicUrl = shareResponse.link.webUrl;

    return { ...response, publicUrl };
  } catch (error) {
    await client.api(`/drives/${driveId}/items/${fileId}`)
      .delete();
      
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