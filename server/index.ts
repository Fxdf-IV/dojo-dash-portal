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
import uploadRoutes from './routes/upload.js';
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
  
  // Servir arquivos estáticos da pasta public (para outros arquivos estáticos, não uploads)
  app.use(express.static('public', {
    maxAge: '1y', // Cache por 1 ano para arquivos estáticos
  }));

  // Middleware para garantir que rotas de upload não sejam processadas por outros middlewares
  app.use('/api/upload', (req, res, next) => {
    console.log('[API] Rota de upload interceptada:', req.method, req.path);
    next();
  });

  // Rotas de upload devem vir ANTES dos middlewares JSON/URL encoded
  // para que o multer possa processar multipart/form-data corretamente
  app.use('/api/upload', uploadRoutes);

  // Middleware para JSON e URL encoded (não processa multipart/form-data)
  // IMPORTANTE: Não processar multipart/form-data aqui
  app.use((req, res, next) => {
    // Pular middlewares JSON/URL encoded para rotas de upload
    if (req.path.startsWith('/api/upload')) {
      return next();
    }
    express.json()(req, res, next);
  });
  
  app.use((req, res, next) => {
    // Pular middlewares JSON/URL encoded para rotas de upload
    if (req.path.startsWith('/api/upload')) {
      return next();
    }
    express.urlencoded({ extended: true })(req, res, next);
  });

  // Logging middleware (dev)
  app.use((req, res, next) => {

    if (!req.path.startsWith('/api')) {
      next();
      return;
    }

    console.log(`[API] ${req.method} ${req.path}`);
    
    // Não tentar ler o body em rotas de upload (multipart/form-data)
    if (!req.path.startsWith('/api/upload')) {
      console.log('Body:', req.body);
    } else {
      console.log('Body: [multipart/form-data - não processado]');
    }
    
    console.log('Query:', JSON.stringify(req.query));
    console.log('Params:', JSON.stringify(req.params));
    console.log('Content-Type:', req.headers['content-type']);
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
  app.use('/api/contact-settings', contactsRoutes);
  app.use('/api/events', eventsRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Adicionar o Express app no middleware do Vite
  middlewares.use(app);

  console.log('✅ API routes configuradas em /api/*');
}
