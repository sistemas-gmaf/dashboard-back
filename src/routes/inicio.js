import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as inicioController from '../controllers/inicio.js';

const api = Router();

api.get('/inicio',
  authMiddleware.isAuthenticated,
  inicioController.get
);

export default api;