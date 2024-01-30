import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as vehiculosMiddleware from '../middlewares/vehiculos.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as vehiculosController from '../controllers/vehiculos.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/vehiculos',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VEHICULOS'),
  vehiculosController.get
);

api.get('/vehiculos/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VEHICULOS'),
  vehiculosController.get
);

api.post('/vehiculos',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_VEHICULO'),
  multerMiddleware.upload.single('vtv'),
  vehiculosMiddleware.upsertVehiculoTipo,
  vehiculosController.create
);

api.patch('/vehiculos/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_VEHICULO'),
  multerMiddleware.upload.single('vtv'),
  vehiculosMiddleware.upsertVehiculoTipo,
  vehiculosController.update
);

api.delete('/vehiculos/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_VEHICULO'),
  vehiculosController.softDelete
);

api.get('/vehiculos-tipos',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VEHICULOS'),
  vehiculosController.getTipos
);

export default api;