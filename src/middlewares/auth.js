import passport from "passport";
import { cca } from "../configs/msal.js";
import { IS_AUTH_BY } from "../configs/app.js";
import { getSession } from "../services/session.js";
import { decrypt } from "../utils/crypto.js";

export const onFail = passport.authenticate('oauth2', { failureRedirect: '/auth/error' });

export const isAuthenticated = async (req, res, next, tries = 0) => {
  const maxTries = 3;
  try {
    if (!req.isAuthenticated() && IS_AUTH_BY === 'cookies') {
      return res.status(401).json({ message: 'Necesita iniciar sesión' });
    }

    if (IS_AUTH_BY === 'authorization' && !req.headers['authorization']) {
      return res.status(400).json({ message: 'Error en la petición, falta header de authorization' });
    }

    if (IS_AUTH_BY === 'authorization') {
      const sid = decrypt(req.headers['authorization']);
      const session = await getSession({ sid });

      if (!session) {
        return res.status(401).json({ message: 'Necesita iniciar sesión' });
      }

      req.user = session.user;
    }
  
    const result = await cca.acquireTokenByRefreshToken({
      refreshToken: req.user.refreshToken,
      scopes: ['openid', 'profile', 'email', 'offline_access', 'user.read', 'Files.ReadWrite.All', 'Mail.Send', 'User.ReadWrite.All']
    });
  
    // Actualiza el token de acceso en la sesión
    req.user.accessToken = result.accessToken;
  
    next();
  } catch (error) {
    console.error(error.message);
    console.debug('Intento fallido ' + tries);
    if (tries >= maxTries) {
      res.status(500).json({ message: 'Error al intentar verificar autenticacion' });
    } else {
      isAuthenticated(req, res, next, tries + 1);
    }
  }
}