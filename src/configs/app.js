import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;

export const DB_USER = process.env.DB_USER;
export const DB_HOST = process.env.DB_HOST;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = process.env.DB_PORT;

export const SECRET = process.env.SECRET;

export const MAX_AGE_SESSION_COOKIE = parseInt(process.env.MAX_AGE_SESSION_COOKIE);

export const ENVIRONMENT = process.env.ENVIRONMENT;

export const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
export const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
export const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI;
export const MICROSOFT_AUTHORIZATION_URL = process.env.MICROSOFT_AUTHORIZATION_URL;
export const MICROSOFT_TOKEN_URL = process.env.MICROSOFT_TOKEN_URL;
export const MICROSOFT_AUTHORITY_URL = process.env.MICROSOFT_AUTHORITY_URL;
export const MICROSOFT_APP_NAME = process.env.MICROSOFT_APP_NAME;
export const MICROSOFT_APP_ID = process.env.MICROSOFT_APP_ID;

export const FRONTEND_URL = process.env.FRONTEND_URL;