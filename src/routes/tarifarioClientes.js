import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as tarifarioMiddleware from '../middlewares/tarifarios.js';
import * as tarifarioClientesController from '../controllers/tarifarioClientes.js';
import * as vehiculosMiddleware from '../middlewares/vehiculos.js';
import * as zonasMiddleware from '../middlewares/zonas.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/tarifario-clientes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_TARIFARIOS'),
  tarifarioClientesController.get
);

api.get('/tarifario-clientes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_TARIFARIOS'),
  tarifarioClientesController.get
);

api.post('/tarifario-clientes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_TARIFARIO_CLIENTE'),
  multerMiddleware.upload.none(),
  zonasMiddleware.upsertZona,
  vehiculosMiddleware.upsertVehiculoTipo,
  tarifarioMiddleware.validateNewTarifarioCliente,
  tarifarioClientesController.create
);

api.patch('/tarifario-clientes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_TARIFARIO_CLIENTE'),
  multerMiddleware.upload.none(),
  tarifarioClientesController.update
);

api.delete('/tarifario-clientes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_TARIFARIO_CLIENTE'),
  tarifarioClientesController.softDelete
);

export default api;