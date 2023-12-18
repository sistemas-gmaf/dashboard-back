import {
  ENVIRONMENT, 
  MAX_AGE_SESSION_COOKIE, 
  SECRET 
} from '../configs/app.js';

import session from 'express-session';

import pgSession from 'connect-pg-simple';
import { dbConnection } from './dbConnection.js';

const PgSession = pgSession(session);

export const sessionConfig = () => 
  session({
    store: new PgSession({
      pool: dbConnection, // Usa el pool de PostgreSQL que configuraste
      tableName: 'session', // Nombre de la tabla donde se almacenarán las sesiones
    }),
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: MAX_AGE_SESSION_COOKIE, // en milisegundos
      secure: (ENVIRONMENT !== 'local'),  // Cambia a true si estás usando HTTPS
      httpOnly: false,  // Puedes cambiar a true si quieres que la cookie solo sea accesible desde el servidor
    },
  });