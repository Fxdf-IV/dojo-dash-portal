import express from 'express';
import cors from 'cors';
import type { Connect } from 'vite';
import { connectDatabase } from './config/database.js';

// Importar rotas
import authRoutes from './routes/auth.js';
import studentsRoutes from './routes/students.js';
import materialsRoutes from './routes/materials.js';
import locationsRoutes from './routes/locations.js';
import senseisRoutes from './routes/senseis.js';
import contactsRoutes from './routes/contacts.js';
import eventsRoutes from './routes/events.js';

export function setupApiServer(middlewares: Connect.Server) {
  // Conectar ao MongoDB
  connectDatabase().catch(console.error);

  // Criar app Express para rotas API
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: [
      '*',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware (dev)
  app.use((req, res, next) => {

    if (!req.path.startsWith('/api')) {
      next();
      return;
    }

    console.log(`[API] ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    console.log('Query:', JSON.stringify(req.query));
    console.log('Params:', JSON.stringify(req.params));
    console.log('--------------------------------');
    next();
  });

  // Rotas API
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentsRoutes);
  app.use('/api/materials', materialsRoutes);
  app.use('/api/locations', locationsRoutes);
  app.use('/api/senseis', senseisRoutes);
  app.use('/api/contacts', contactsRoutes);
  app.use('/api/events', eventsRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Adicionar o Express app no middleware do Vite
  middlewares.use(app);

  console.log('✅ API routes configuradas em /api/*');
}
