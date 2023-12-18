import passport from "passport";
import { FRONTEND_URL } from "../configs/app.js";

export const login = passport.authenticate('oauth2');

export const logout = (req, res) => {
  // Estos método es proporcionado por Passport y se encarga de eliminar la sesión del usuario
  res.status(200).clearCookie('connect.sid', {
    path: '/'
  });
  req.session.destroy((err) => res.redirect(FRONTEND_URL)); 
};

export const onLogin = (req, res) => {
  res.redirect(`${FRONTEND_URL}/dashboard/inicio`);
};

export const onError = (req, res) => {
  res.redirect(FRONTEND_URL + '?alert=' + encodeURIComponent('Ocurrió un error al autenticarse, verifica que tu usuario este registrado'));
};

export const onUnauthorized = (req, res) => {
  res.status(401).json({ message: 'Necesita iniciar sesión' });
}