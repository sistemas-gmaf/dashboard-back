import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as tarifarioMiddleware from '../middlewares/tarifarios.js';
import * as tarifarioTransportesEspecialesController from '../controllers/tarifarioTransportesEspeciales.js';
import * as vehiculosMiddleware from '../middlewares/vehiculos.js';
import * as zonasMiddleware from '../middlewares/zonas.js';

const api = Router();

api.get('/tarifario-transportes-especiales',
  authMiddleware.isAuthenticated,
  tarifarioTransportesEspecialesController.get
);

api.get('/tarifario-transportes-especiales/:id',
  authMiddleware.isAuthenticated,
  tarifarioTransportesEspecialesController.get
);

api.post('/tarifario-transportes-especiales',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  zonasMiddleware.upsertZona,
  vehiculosMiddleware.upsertVehiculoTipo,
  tarifarioMiddleware.validateNewTarifarioTransporteEspecial,
  tarifarioTransportesEspecialesController.create
);

api.patch('/tarifario-transportes-especiales/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  tarifarioTransportesEspecialesController.update
);

api.delete('/tarifario-transportes-especiales/:id',
  authMiddleware.isAuthenticated,
  tarifarioTransportesEspecialesController.softDelete
);

export default api;