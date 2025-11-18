import express from 'express';
import multer from 'multer';
import Image from '../models/Image.js';

// Configurar multer para armazenar em memória (não em disco)
const storage = multer.memoryStorage();

// Filtro para aceitar apenas imagens
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const router = express.Router();

// GET /api/upload/image/:id - Servir imagem do MongoDB
router.get('/image/:id', async (req: express.Request, res: express.Response) => {
  try {
    const imageId = req.params.id;
    
    console.log('[Upload] Buscando imagem no MongoDB:', imageId);
    
    const image = await Image.findById(imageId);
    
    if (!image) {
      console.error('[Upload] Imagem não encontrada no MongoDB:', imageId);
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    // Configurar headers apropriados
    res.set({
      'Content-Type': image.mimetype,
      'Content-Length': image.size,
      'Cache-Control': 'public, max-age=31536000', // Cache por 1 ano
    });
    
    // Enviar o buffer da imagem
    res.send(image.data);
    
    console.log('[Upload] Imagem servida com sucesso:', imageId);
  } catch (error: any) {
    console.error('[Upload] Erro ao servir imagem:', error);
    res.status(500).json({ error: 'Erro ao servir imagem' });
  }
});

// POST /api/upload/image
router.post('/image', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('[Upload] Requisição recebida');
  console.log('[Upload] Content-Type:', req.headers['content-type']);
  console.log('[Upload] Method:', req.method);
  
  upload.single('image')(req, res, async (err: any) => {
    if (err) {
      console.error('[Upload] Erro do multer:', err);
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB' });
        }
        return res.status(400).json({ error: err.message });
      }
      
      return res.status(400).json({ error: err.message || 'Erro ao processar arquivo' });
    }
    
    try {
      console.log('[Upload] req.file:', req.file ? {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        bufferSize: req.file.buffer?.length
      } : 'null');
      
      if (!req.file || !req.file.buffer) {
        console.error('[Upload] Nenhum arquivo recebido após processamento');
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Gerar nome único para o arquivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = req.file.originalname.split('.').pop() || '';
      const filename = `image-${uniqueSuffix}.${ext}`;

      // Salvar imagem no MongoDB
      const image = await Image.create({
        filename: filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      });

      const imageId = (image as any)._id.toString();
      console.log('[Upload] Imagem salva no MongoDB:', imageId, 'Tamanho:', req.file.size);
      
      // Retornar URL da API para acessar a imagem
      const imageUrl = `/api/upload/image/${imageId}`;
      console.log('[Upload] Retornando URL:', imageUrl);
      res.json({ imageUrl });
    } catch (error: any) {
      console.error('[Upload] Erro no processamento:', error);
      res.status(500).json({ error: error.message || 'Erro ao processar upload' });
    }
  });
});

// DELETE /api/upload/image/:id - Remover imagem do MongoDB
router.delete('/image/:id', async (req: express.Request, res: express.Response) => {
  try {
    const imageId = req.params.id;
    
    console.log('[Upload] Removendo imagem do MongoDB:', imageId);
    
    const image = await Image.findByIdAndDelete(imageId);
    
    if (!image) {
      console.error('[Upload] Imagem não encontrada no MongoDB:', imageId);
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    console.log('[Upload] Imagem removida com sucesso:', imageId);
    res.json({ success: true, message: 'Imagem removida com sucesso' });
  } catch (error: any) {
    console.error('[Upload] Erro ao remover imagem:', error);
    res.status(500).json({ error: 'Erro ao remover imagem' });
  }
});

export default router;

