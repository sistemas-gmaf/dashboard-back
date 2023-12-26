import { Router } from "express";
import multer from "multer";
import * as authMiddleware from '../middlewares/auth.js';
import * as transportesController from '../controllers/transportes.js';

const api = Router();
const upload = multer();

api.get('/transportes',
  authMiddleware.isAuthenticated,
  transportesController.get
);

api.get('/transportes/:id',
  authMiddleware.isAuthenticated,
  transportesController.get
);

api.post('/transportes',
  authMiddleware.isAuthenticated,
  transportesController.create
);

api.patch('/transportes/:id',
  authMiddleware.isAuthenticated,
  upload.none(),
  transportesController.update
);

api.delete('/transportes/:id',
  authMiddleware.isAuthenticated,
  transportesController.softDelete
);

export default api;