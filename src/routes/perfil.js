import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as perfilController from '../controllers/perfil.js';

const api = Router();

api.get('/perfil',
    authMiddleware.isAuthenticated,
    perfilController.get
);

export default api;