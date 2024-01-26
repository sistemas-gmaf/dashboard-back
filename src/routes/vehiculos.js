import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as vehiculosMiddleware from '../middlewares/vehiculos.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as vehiculosController from '../controllers/vehiculos.js';

const api = Router();

api.get('/vehiculos',
  authMiddleware.isAuthenticated,
  vehiculosController.get
);

api.get('/vehiculos/:id',
  authMiddleware.isAuthenticated,
  vehiculosController.get
);

api.post('/vehiculos',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.single('vtv'),
  vehiculosMiddleware.upsertVehiculoTipo,
  vehiculosController.create
);

api.patch('/vehiculos/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.single('vtv'),
  vehiculosMiddleware.upsertVehiculoTipo,
  vehiculosController.update
);

api.delete('/vehiculos/:id',
  authMiddleware.isAuthenticated,
  vehiculosController.softDelete
);

api.get('/vehiculos-tipos',
  authMiddleware.isAuthenticated,
  vehiculosController.getTipos
);

export default api;