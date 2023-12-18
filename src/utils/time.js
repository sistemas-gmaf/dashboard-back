import moment from "moment";
import 'moment-timezone';

export const getTimestamp = () => {
  return moment.tz('America/Argentina/Buenos_Aires').format();
}