import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as usuariosController from '../controllers/usuarios.js';

const api = Router();

api.get('/usuarios',
  authMiddleware.isAuthenticated,
  usuariosController.get
);

api.get('/usuarios/:id',
  authMiddleware.isAuthenticated,
  usuariosController.get
  );
  
api.post('/usuarios',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  usuariosController.create
);

api.patch('/usuarios/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  usuariosController.update
);

api.delete('/usuarios/:id',
  authMiddleware.isAuthenticated,
  usuariosController.softDelete
);

api.get('/usuarios-roles-permisos',
  authMiddleware.isAuthenticated,
  usuariosController.getRolesPermisos
);

export default api;