import { Router } from "express";
import * as multerMiddleware from '../middlewares/multer.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as transportesController from '../controllers/transportes.js';

const api = Router();

api.get('/transportes',
  authMiddleware.isAuthenticated,
  transportesController.get
);

api.get('/transportes/:id',
  authMiddleware.isAuthenticated,
  transportesController.get
);

api.post('/transportes',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.single('constancia_afip'),
  transportesController.create
);

api.patch('/transportes/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.single('constancia_afip'),
  transportesController.update
);

api.delete('/transportes/:id',
  authMiddleware.isAuthenticated,
  transportesController.softDelete
);

export default api;