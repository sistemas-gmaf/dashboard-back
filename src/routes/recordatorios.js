import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as recordatoriosController from '../controllers/recordatorios.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/recordatorios',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_RECORDATORIOS'),
  recordatoriosController.get
);

api.get('/recordatorios/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_RECORDATORIOS'),
  recordatoriosController.get
  );
  
api.post('/recordatorios',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_RECORDATORIO'),
  multerMiddleware.upload.none(),
  recordatoriosController.create
);

api.patch('/recordatorios/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_RECORDATORIO'),
  multerMiddleware.upload.none(),
  recordatoriosController.update
);

api.delete('/recordatorios/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_RECORDATORIO'),
  recordatoriosController.softDelete
);

export default api;