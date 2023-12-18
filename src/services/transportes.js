import { dbConnection } from "../configs/dbConnection.js";

export const get = async ({ id }) => {
  try {
    let result;
    let query = `SELECT * FROM transporte`;
  
    if (Boolean(id)) {
      query += ` id=$1`;
      result = await dbConnection.query(query, [id]);
    } else {
      result = await dbConnection.query(query);
    }
  
    return result.rows;
  } catch (error) {
    throw error;
  }
}