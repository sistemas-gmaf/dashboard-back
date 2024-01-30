import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as viajesController from '../controllers/viajes.js';
import * as viajesMiddleware from '../middlewares/viajes.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/viajes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VIAJES'),
  viajesController.get
);

api.get('/viajes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VIAJES'),
  viajesController.getDetail
  );
  
api.post('/viajes',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_VIAJE'),
  multerMiddleware.upload.none(),
  viajesMiddleware.validateTarifario,
  viajesController.create
);

api.patch('/viajes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_VIAJE'),
  multerMiddleware.upload.none(),
  viajesMiddleware.validateTarifario,
  viajesController.update
);

api.delete('/viajes/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_VIAJE'),
  viajesController.softDelete
);

api.get('/viajes-calcular-tarifa',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VIAJES'),
  viajesController.calculateTarifas
)

api.get('/viajes-especiales',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VIAJES'),
  viajesController.getEspecial
);

api.get('/viajes-especiales/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_VIAJES'),
  viajesController.getEspecial
);

api.patch('/viajes-especiales/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('APROBAR_VIAJE'),
  multerMiddleware.upload.none(),
  viajesController.updateEspecial
);

export default api;