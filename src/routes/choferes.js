import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as choferesController from '../controllers/choferes.js';
import * as multerMiddleware from '../middlewares/multer.js';

const api = Router();

api.get('/choferes',
  authMiddleware.isAuthenticated,
  choferesController.get
);

api.get('/choferes/:id',
  authMiddleware.isAuthenticated,
  choferesController.get
);

api.post('/choferes',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.fields([
    { name: 'dni_frente', maxCount: 1 },
    { name: 'dni_dorso', maxCount: 1 },
    { name: 'licencia_conducir_frente', maxCount: 1 },
    { name: 'licencia_conducir_dorso', maxCount: 1 },
    { name: 'seguro_vehiculo', maxCount: 1 },
    { name: 'seguro_vida', maxCount: 1 },
  ]),
  choferesController.create
);

api.patch('/choferes/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.fields([
    { name: 'dni_frente', maxCount: 1 },
    { name: 'dni_dorso', maxCount: 1 },
    { name: 'licencia_conducir_frente', maxCount: 1 },
    { name: 'licencia_conducir_dorso', maxCount: 1 },
    { name: 'seguro_vehiculo', maxCount: 1 },
    { name: 'seguro_vida', maxCount: 1 },
  ]),
  choferesController.update
);

api.delete('/choferes/:id',
  authMiddleware.isAuthenticated,
  choferesController.softDelete
)

export default api;