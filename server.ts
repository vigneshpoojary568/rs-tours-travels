import './server/env';
import express from 'express';
import path from 'node:path';
import { vehicleApi } from './server/vehicles';

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  const app = express();
  app.disable('x-powered-by');

  // Vehicle API + (local-dev) photo serving
  app.use(vehicleApi);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`RS Tours server running on http://localhost:${PORT}`));
}

start();
