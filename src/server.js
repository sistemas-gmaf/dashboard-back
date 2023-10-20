import { PORT } from './configs/app.js';

import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('app corriendo...'));

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));