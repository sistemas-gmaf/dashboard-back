import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as usuariosController from '../controllers/usuarios.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/usuarios',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_GESTION_USUARIOS'),
  usuariosController.get
);

api.get('/usuarios/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_GESTION_USUARIOS'),
  usuariosController.get
  );
  
api.post('/usuarios',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_USUARIO'),
  multerMiddleware.upload.none(),
  usuariosController.create
);

api.patch('/usuarios/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_USUARIO'),
  multerMiddleware.upload.none(),
  usuariosController.update
);

api.delete('/usuarios/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_USUARIO'),
  usuariosController.softDelete
);

api.get('/usuarios-roles-permisos',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_GESTION_USUARIOS'),
  usuariosController.getRolesPermisos
);

export default api;