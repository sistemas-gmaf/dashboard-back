import { dbConnection } from "../configs/dbConnection.js";

export const get = async () => {
  try {
    let query = `SELECT * FROM zona WHERE activo=TRUE`;

    let result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}