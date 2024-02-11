import moment from "moment";
import 'moment-timezone';

export const getTimestamp = () => {
  return moment.tz('America/Argentina/Buenos_Aires').format();
}

export const getDate = () => {
  return moment.tz('America/Argentina/Buenos_Aires').format('YYYYMMDD');
}

export const getMomentDate = () => {
  return moment.tz('America/Argentina/Buenos_Aires');
}