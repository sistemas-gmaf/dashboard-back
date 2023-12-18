import passport from "passport";
import { cca } from "../configs/msal.js";

export const onFail = passport.authenticate('oauth2', { failureRedirect: '/auth/error' });

export const isAuthenticated = async (req, res, next, tries = 0) => {
  const maxTries = 3;
  try {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/unauthorized');
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