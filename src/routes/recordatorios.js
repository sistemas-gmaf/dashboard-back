import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.js';
import * as multerMiddleware from '../middlewares/multer.js';
import * as recordatoriosController from '../controllers/recordatorios.js';

const api = Router();

api.get('/recordatorios',
  authMiddleware.isAuthenticated,
  recordatoriosController.get
);

api.get('/recordatorios/:id',
  authMiddleware.isAuthenticated,
  recordatoriosController.get
  );
  
api.post('/recordatorios',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  recordatoriosController.create
);

api.patch('/recordatorios/:id',
  authMiddleware.isAuthenticated,
  multerMiddleware.upload.none(),
  recordatoriosController.update
);

api.delete('/recordatorios/:id',
  authMiddleware.isAuthenticated,
  recordatoriosController.softDelete
);

export default api;