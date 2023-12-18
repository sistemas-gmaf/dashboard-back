import { 
  MICROSOFT_AUTHORIZATION_URL, 
  MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET, 
  MICROSOFT_REDIRECT_URI, 
  MICROSOFT_TOKEN_URL 
} from './app.js';

import { Strategy as OAuth2Strategy } from 'passport-oauth2';

import { dbConnection } from './dbConnection.js';
import * as msGraphService from '../services/msGraph.js';

export const oauthStrategyConfig = new OAuth2Strategy({
  clientID: MICROSOFT_CLIENT_ID,
  clientSecret: MICROSOFT_CLIENT_SECRET,
  callbackURL: MICROSOFT_REDIRECT_URI,
  authorizationURL: MICROSOFT_AUTHORIZATION_URL,
  tokenURL: MICROSOFT_TOKEN_URL,
  scope: ['openid', 'profile', 'email', 'offline_access', 'user.read', 'Files.ReadWrite.All', 'Mail.Send', 'User.ReadWrite.All']
}, async (accessToken, refreshToken, profile, done) => {
  // Verificar el correo electrónico en la base de datos
  const userProfile = await msGraphService.getUserProfile({ accessToken });

  // Consultar en la base de datos
  dbConnection.query('SELECT * FROM usuario WHERE correo = $1', [userProfile.mail], (err, result) => {
    if (err) {
      return done(err);
    }

    // Comprobar si el correo electrónico existe en la base de datos
    if (result.rows.length > 0) {
      return done(null, { accessToken, refreshToken, profile: userProfile });  // Info que va a estar en cada req.user
    } else {
      return done(null, false, { message: 'Correo electrónico no registrado' });
    }
  });
});