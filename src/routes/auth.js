import { Router } from "express";
import * as authController from '../controllers/auth.js';
import * as authMiddleware from '../middlewares/auth.js';

const api = Router();

// Ruta de inicio de sesión
api.get('/auth/login', authController.login);

// Ruta de cierre de sesión
api.get('/auth/logout',
    authController.logout
);

// Ruta de redireccionamiento después de la autenticación
api.get('/auth/callback',
    authMiddleware.onFail,
    authController.onLogin
);

api.get('/auth/error', authController.onError);

api.get('/auth/unauthorized', authController.onUnauthorized)

export default api;