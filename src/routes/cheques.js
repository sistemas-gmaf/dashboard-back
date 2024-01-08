import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as chequesController from '../controllers/cheques.js';

const api = Router();

api.get('/cheques',
  authMiddleware.isAuthenticated,
  chequesController.get
);

api.get('/cheques/:id',
  authMiddleware.isAuthenticated,
  chequesController.get
  );
  
api.post('/cheques',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  chequesController.create
);

api.patch('/cheques/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  chequesController.update
);

api.delete('/cheques/:id',
  authMiddleware.isAuthenticated,
  chequesController.softDelete
);

api.get('/cheques-bancos',
  authMiddleware.isAuthenticated,
  chequesController.getBancos
);

api.get('/cheques-referencias',
  authMiddleware.isAuthenticated,
  chequesController.getReferencias
);

api.get('/cheques-proveedores',
  authMiddleware.isAuthenticated,
  chequesController.getProveedores
);

api.get('/cheques-estados',
  authMiddleware.isAuthenticated,
  chequesController.getEstados
);

export default api;