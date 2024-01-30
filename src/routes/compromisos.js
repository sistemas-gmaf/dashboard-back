import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as compromisosController from '../controllers/compromisos.js';
import * as permisosMiddleware from '../middlewares/permisos.js';

const api = Router();

api.get('/compromisos',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_COMPROMISOS'),
  compromisosController.get
);

api.get('/compromisos/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_COMPROMISOS'),
  compromisosController.get
  );
  
api.post('/compromisos',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('CREAR_COMPROMISO'),
  multerMiddleware.upload.none(),
  compromisosController.create
);

api.patch('/compromisos/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('EDITAR_COMPROMISO'),
  multerMiddleware.upload.none(),
  compromisosController.update
);

api.delete('/compromisos/:id',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('ELIMINAR_COMPROMISO'),
  compromisosController.softDelete
);

api.get('/compromisos-categorias',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_COMPROMISOS'),
  compromisosController.getCategorias
);

api.get('/compromisos-razones-sociales',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_COMPROMISOS'),
  compromisosController.getRazonesSociales
);

api.get('/compromisos-referencias',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_COMPROMISOS'),
  compromisosController.getReferencias
);

api.get('/compromisos-estados',
  authMiddleware.isAuthenticated,
  permisosMiddleware.validar('VER_COMPROMISOS'),
  compromisosController.getEstados
);


export default api;