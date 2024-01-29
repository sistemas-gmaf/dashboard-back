import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as viajesController from '../controllers/viajes.js';
import * as viajesMiddleware from '../middlewares/viajes.js';

const api = Router();

api.get('/viajes',
  authMiddleware.isAuthenticated,
  viajesController.get
);

api.get('/viajes/:id',
  authMiddleware.isAuthenticated,
  viajesController.getDetail
  );
  
api.post('/viajes',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  viajesMiddleware.validateTarifario,
  viajesController.create
);

api.patch('/viajes/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  viajesController.update
);

api.delete('/viajes/:id',
  authMiddleware.isAuthenticated,
  viajesController.softDelete
);

api.get('/viajes-calcular-tarifa',
  authMiddleware.isAuthenticated,
  viajesController.calculateTarifas
)

api.get('/viajes-especiales',
  authMiddleware.isAuthenticated,
  viajesController.getEspecial
);

api.get('/viajes-especiales/:id',
  authMiddleware.isAuthenticated,
  viajesController.getEspecial
);

export default api;