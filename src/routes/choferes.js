import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as choferesController from '../controllers/choferes.js';

const api = Router();

api.get('/choferes',
  authMiddleware.isAuthenticated,
  choferesController.get
);

export default api;