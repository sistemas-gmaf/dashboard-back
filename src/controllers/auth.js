import passport from "passport";
import { FRONTEND_URL, IS_AUTH_BY } from "../configs/app.js";
import { encrypt } from "../utils/crypto.js";

export const login = passport.authenticate('oauth2');

export const logout = (req, res) => {
  // Estos método es proporcionado por Passport y se encarga de eliminar la sesión del usuario
  res.status(200).clearCookie('connect.sid', {
    path: '/'
  });
  req.session.destroy((err) => res.redirect(FRONTEND_URL)); 
};

export const onLogin = (req, res) => {
  if (IS_AUTH_BY === 'cookies') {
    res.redirect(`${FRONTEND_URL}/dashboard/inicio`);
  }
  if (IS_AUTH_BY === 'authorization') {
    const authorization = encrypt(req.sessionID);
    res.redirect(`${FRONTEND_URL}/dashboard/inicio?authorization=${encodeURIComponent(authorization)}&expires=${encodeURIComponent(req.session.cookie.expires.toISOString())}`);
  }
};

export const onError = (req, res) => {
  res.redirect(FRONTEND_URL + '?alert=' + encodeURIComponent('Ocurrió un error al autenticarse, verifica que tu usuario este registrado'));
};

export const onUnauthorized = (req, res) => {
  res.status(401).json({ message: 'Necesita iniciar sesión' });
}