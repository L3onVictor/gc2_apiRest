import express from 'express';
import bookRouter from './routes/bookRouter.js';

import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = 3030;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use('/api', bookRouter);

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Link: http://localhost:${PORT}`);
});