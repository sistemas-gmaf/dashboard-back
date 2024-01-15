import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as tarifarioViajesEspecialesController from '../controllers/tarifarioViajesEspeciales.js';

const api = Router();

api.get('/tarifario-viajes-especiales',
  authMiddleware.isAuthenticated,
  tarifarioViajesEspecialesController.get
);

api.get('/tarifario-viajes-especiales/:id',
  authMiddleware.isAuthenticated,
  tarifarioViajesEspecialesController.get
);

api.post('/tarifario-viajes-especiales',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  tarifarioViajesEspecialesController.create
);

api.patch('/tarifario-viajes-especiales/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  tarifarioViajesEspecialesController.update
);

api.delete('/tarifario-viajes-especiales/:id',
  authMiddleware.isAuthenticated,
  tarifarioViajesEspecialesController.softDelete
);

export default api;