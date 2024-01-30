import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as tarifarioMiddleware from '../middlewares/tarifarios.js';
import * as tarifarioTransportesEspecialesController from '../controllers/tarifarioTransportesEspeciales.js';
import * as vehiculosMiddleware from '../middlewares/vehiculos.js';
import * as zonasMiddleware from '../middlewares/zonas.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/tarifario-transportes-especiales',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_TARIFARIOS'),
  tarifarioTransportesEspecialesController.get
);

api.get('/tarifario-transportes-especiales/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_TARIFARIOS'),
  tarifarioTransportesEspecialesController.get
);

api.post('/tarifario-transportes-especiales',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_TARIFARIO_PROVEEDOR_ESPECIAL'),
  multerMiddleware.upload.none(),
  zonasMiddleware.upsertZona,
  vehiculosMiddleware.upsertVehiculoTipo,
  tarifarioMiddleware.validateNewTarifarioTransporteEspecial,
  tarifarioTransportesEspecialesController.create
);

api.patch('/tarifario-transportes-especiales/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_TARIFARIO_PROVEEDOR_ESPECIAL'),
  multerMiddleware.upload.none(),
  tarifarioTransportesEspecialesController.update
);

api.delete('/tarifario-transportes-especiales/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_TARIFARIO_PROVEEDOR_ESPECIAL'),
  tarifarioTransportesEspecialesController.softDelete
);

export default api;