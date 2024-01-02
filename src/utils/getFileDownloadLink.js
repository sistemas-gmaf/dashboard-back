import * as msGraphService from "../services/msGraph.js";

export const getFileDownloadLink = async ({ accessToken, itemId, driveId }) => {
  let url;

  if (itemId && driveId) {
    url = await msGraphService.getDownloadUrl({ 
      accessToken, 
      driveId,
      itemId
    });
  }

  return url;
}