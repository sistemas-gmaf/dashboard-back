import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as zonasController from '../controllers/zonas.js';

const api = Router();

api.get('/zonas',
  authMiddleware.isAuthenticated,
  zonasController.get
);

export default api;