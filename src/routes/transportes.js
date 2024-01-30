import { Router } from "express";
import * as multerMiddleware from '../middlewares/multer.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as transportesController from '../controllers/transportes.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/transportes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_TRANSPORTES'),
  transportesController.get
);

api.get('/transportes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_TRANSPORTES'),
  transportesController.get
);

api.post('/transportes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_TRANSPORTE'),
  multerMiddleware.upload.single('constancia_afip'),
  transportesController.create
);

api.patch('/transportes/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.single('constancia_afip'),
  permisosMiddleware.validar('EDITAR_TRANSPORTE'),
  transportesController.update
);

api.delete('/transportes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_TRANSPORTE'),
  transportesController.softDelete
);

export default api;