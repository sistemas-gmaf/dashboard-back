import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as clientesController from '../controllers/clientes.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/clientes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CLIENTES'),
  clientesController.get
);

api.get('/clientes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_CLIENTES'),
  clientesController.get
  );
  
api.post('/clientes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_CLIENTE'),
  multerMiddleware.upload.none(),
  clientesController.create
);

api.patch('/clientes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_CLIENTE'),
  multerMiddleware.upload.none(),
  clientesController.update
);

api.delete('/clientes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_CLIENTE'),
  clientesController.softDelete
);

export default api;