import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as compromisosController from '../controllers/compromisos.js';

const api = Router();

api.get('/compromisos',
  authMiddleware.isAuthenticated,
  compromisosController.get
);

api.get('/compromisos/:id',
  authMiddleware.isAuthenticated,
  compromisosController.get
  );
  
api.post('/compromisos',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  compromisosController.create
);

api.patch('/compromisos/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  compromisosController.update
);

api.delete('/compromisos/:id',
  authMiddleware.isAuthenticated,
  compromisosController.softDelete
);

api.get('/compromisos-categorias',
  authMiddleware.isAuthenticated,
  compromisosController.getCategorias
);

api.get('/compromisos-razones-sociales',
  authMiddleware.isAuthenticated,
  compromisosController.getRazonesSociales
);

api.get('/compromisos-referencias',
  authMiddleware.isAuthenticated,
  compromisosController.getReferencias
);

api.get('/compromisos-estados',
  authMiddleware.isAuthenticated,
  compromisosController.getEstados
);


export default api;