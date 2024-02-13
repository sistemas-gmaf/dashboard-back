const dbErrorToHTTP = {
  '23505': '409'
};

export const parseDatabaseError = (code) => {
  if (typeof dbErrorToHTTP[code] !== 'undefined') {
    return dbErrorToHTTP[code];
  }
  return false;
}