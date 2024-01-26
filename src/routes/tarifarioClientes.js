import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as tarifarioMiddleware from '../middlewares/tarifarios.js';
import * as tarifarioClientesController from '../controllers/tarifarioClientes.js';
import * as vehiculosMiddleware from '../middlewares/vehiculos.js';
import * as zonasMiddleware from '../middlewares/zonas.js';

const api = Router();

api.get('/tarifario-clientes',
  authMiddleware.isAuthenticated,
  tarifarioClientesController.get
);

api.get('/tarifario-clientes/:id',
  authMiddleware.isAuthenticated,
  tarifarioClientesController.get
);

api.post('/tarifario-clientes',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  zonasMiddleware.upsertZona,
  vehiculosMiddleware.upsertVehiculoTipo,
  tarifarioMiddleware.validateNewTarifarioCliente,
  tarifarioClientesController.create
);

api.patch('/tarifario-clientes/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  tarifarioClientesController.update
);

api.delete('/tarifario-clientes/:id',
  authMiddleware.isAuthenticated,
  tarifarioClientesController.softDelete
);

export default api;