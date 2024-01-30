import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as permisosMiddleware from '../middlewares/permisos.js';
import * as inicioController from '../controllers/inicio.js';

const api = Router();

api.get('/inicio',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_INICIO'),
  inicioController.get
);

export default api;