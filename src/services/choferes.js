import { dbConnection } from "../configs/dbConnection.js";

export const get = async () => {
  try {
    const query = 'SELECT * FROM chofer';
  
    const result = await dbConnection.query(query);
  
    return result.rows;
  } catch (error) {
    throw error;
  }
}