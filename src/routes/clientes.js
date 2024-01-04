import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as clientesController from '../controllers/clientes.js';

const api = Router();

api.get('/clientes',
  authMiddleware.isAuthenticated,
  clientesController.get
);

api.get('/clientes/:id',
  authMiddleware.isAuthenticated,
  clientesController.get
  );
  
api.post('/clientes',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  clientesController.create
);

api.patch('/clientes/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  clientesController.update
);

api.delete('/clientes/:id',
  authMiddleware.isAuthenticated,
  clientesController.softDelete
);

export default api;