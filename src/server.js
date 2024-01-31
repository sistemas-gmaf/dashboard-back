import { FRONTEND_URL, PORT } from './configs/app.js';

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';

import routes from './routes/index.mjs';

import { oauthStrategyConfig } from './configs/oauth.js';
import { sessionConfig } from './configs/session.js';

const app = express();

// Configura la estrategia de autenticación OAuth2
passport.use(oauthStrategyConfig);

// Serializa y deserializa el usuario en la sesión
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Configuración de la sesión con connect-pg-simple
app.use(sessionConfig());

// Configura Passport para manejar la autenticación
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))

app.use('', routes);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));