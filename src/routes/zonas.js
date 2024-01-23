import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as zonasController from '../controllers/zonas.js';

const api = Router();

api.get('/zonas',
  authMiddleware.isAuthenticated,
  zonasController.get
);

api.post('/zonas',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  zonasController.create
);

export default api;