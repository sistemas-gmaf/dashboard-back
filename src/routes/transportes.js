import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as transportesController from '../controllers/transportes.js';

const api = Router();

api.get('/transportes',
  authMiddleware.isAuthenticated,
  transportesController.get
);

export default api;