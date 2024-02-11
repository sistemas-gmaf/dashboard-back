import moment from "moment";
import { dbConnection } from "../configs/dbConnection.js";
import { getMomentDate } from "../utils/time.js";

export const getSession = async ({ sid }) => {
  try {
    const query = `SELECT sess FROM session WHERE sid=$1`;
    const result = await dbConnection.query(query, [sid]);

    const expireDate = moment(result.rows[0].sess.cookie.expires);
    const actualDate = getMomentDate();

    if (expireDate.isBefore(actualDate)) {
      const deleteQuery = 'DELETE FROM session WHERE sid=$1';
      await dbConnection.query(deleteQuery, [sid]);
      return false;
    }

    return result.rows[0].sess.passport;
  } catch (error) {
    throw error;
  }
}