import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as importacionesMasivasController from '../controllers/importacionesMasivas.js';

const api = Router();

api.post('/importar-tarifarios',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  importacionesMasivasController.importarTarifarios
);

export default api;