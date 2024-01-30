import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as chequesController from '../controllers/cheques.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/cheques',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CHEQUES'),
  chequesController.get
);

api.get('/cheques/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CHEQUES'),
  chequesController.get
  );
  
api.post('/cheques',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_CHEQUE'),
  multerMiddleware.upload.none(),
  chequesController.create
);

api.patch('/cheques/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_CHEQUE'),
  multerMiddleware.upload.none(),
  chequesController.update
);

api.delete('/cheques/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_CHEQUE'),
  chequesController.softDelete
);

api.get('/cheques-bancos',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CHEQUES'),
  chequesController.getBancos
);

api.get('/cheques-referencias',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CHEQUES'),
  chequesController.getReferencias
);

api.get('/cheques-proveedores',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CHEQUES'),
  chequesController.getProveedores
);

api.get('/cheques-estados',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CHEQUES'),
  chequesController.getEstados
);

export default api;