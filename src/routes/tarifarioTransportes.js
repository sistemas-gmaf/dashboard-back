import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as tarifarioMiddleware from '../middlewares/tarifarios.js';
import * as tarifarioTransportesController from '../controllers/tarifarioTransportes.js';

const api = Router();

api.get('/tarifario-transportes',
  authMiddleware.isAuthenticated,
  tarifarioTransportesController.get
);

api.get('/tarifario-transportes/:id',
  authMiddleware.isAuthenticated,
  tarifarioTransportesController.get
);

api.post('/tarifario-transportes',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  tarifarioMiddleware.validateNewTarifarioTransporte,
  tarifarioTransportesController.create
);

api.patch('/tarifario-transportes/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  tarifarioTransportesController.update
);

api.delete('/tarifario-transportes/:id',
  authMiddleware.isAuthenticated,
  tarifarioTransportesController.softDelete
);

export default api;