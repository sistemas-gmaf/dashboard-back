import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Lee todos los archivos en el directorio de rutas, excepto el archivo index.mjs
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.mjs')
  .forEach(async file => {
    const filePath = path.join(__dirname, file);
    const route = await import('file://' + filePath);
    // Asigna las rutas al router
    router.use('/', route.default);
  });

export default router;
