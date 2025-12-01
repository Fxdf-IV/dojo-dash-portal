import { Router } from 'express';
import multer from 'multer';
import Location from '../models/Location.js';
import Image from '../models/Image.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Configurar multer para armazenar em memória (não em disco)
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

// Helper para transformar _id em id
const transformLocation = (location: any) => {
  const obj = location.toObject ? location.toObject() : location;
  return {
    id: obj._id.toString(),
    name: obj.name,
    description: obj.description,
    mapUrl: obj.mapUrl,
    imageUrl: obj.imageUrl,
    images: obj.images?.map((img: any) => ({
      imageUrl: img.imageUrl,
      caption: img.caption,
    })) || [],
    schedule: obj.schedule || [],
    orderIndex: obj.orderIndex ?? 0,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// GET /api/locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().sort({ orderIndex: 1, createdAt: -1 });
    res.json({ locations: locations.map(transformLocation) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/locations/reorder - Atualizar ordem dos locais
router.put('/reorder', authenticate, requireAdmin, async (req: any, res) => {
  try {
    const { locations: locationsOrder } = req.body;

    if (!Array.isArray(locationsOrder)) {
      return res.status(400).json({ error: 'Formato de reorder inválido' });
    }

    // Atualizar orderIndex para cada local
    for (let i = 0; i < locationsOrder.length; i++) {
      await Location.findByIdAndUpdate(
        locationsOrder[i].id,
        { orderIndex: i },
        { new: true }
      );
    }

    res.json({ success: true, message: 'Ordem atualizada com sucesso' });
  } catch (error: any) {
    console.error('[Locations] Erro ao reordenar:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/locations/:id
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    res.json({ location: transformLocation(location) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/locations - Criar novo local
router.post('/', authenticate, requireAdmin, upload.single('image'), async (req: any, res) => {
  try {
    const { name, description, mapUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome do local é obrigatório' });
    }

    let imageUrl = undefined;
    if (req.file && req.file.buffer) {
      // Gerar nome único para o arquivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = req.file.originalname.split('.').pop() || '';
      const filename = `location-${uniqueSuffix}.${ext}`;

      // Salvar imagem no MongoDB
      const image = await Image.create({
        filename: filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      });

      const imageId = (image as any)._id.toString();
      imageUrl = `/api/upload/image/${imageId}`;
    }

    // Criar novo local
    let schedule = req.body.schedule;
    if (typeof schedule === 'string') {
      try {
        schedule = JSON.parse(schedule);
      } catch (e) {
        schedule = [];
      }
    }

    const location = await Location.create({
      name,
      description: description || '',
      mapUrl: mapUrl || '',
      imageUrl,
      images: [],
      schedule: schedule || [],
    });

    res.json({ location: transformLocation(location) });
  } catch (error: any) {
    console.error('[Locations] Erro ao criar local:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/locations/:id - Atualizar local
router.put('/:id', authenticate, requireAdmin, upload.single('image'), async (req: any, res) => {
  try {
    const { name, description, mapUrl, removeImage } = req.body;

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    location.name = name || location.name;
    location.description = description !== undefined ? description : location.description;
    location.mapUrl = mapUrl !== undefined ? mapUrl : location.mapUrl;

    if (req.file && req.file.buffer) {
      // Remover imagem anterior do banco se existir
      if (location.imageUrl && location.imageUrl.startsWith('/api/upload/image/')) {
        const oldImageId = location.imageUrl.split('/').pop();
        if (oldImageId) {
          try {
            await Image.findByIdAndDelete(oldImageId);
          } catch (error) {
            console.warn('[Locations] Erro ao remover imagem anterior:', error);
          }
        }
      }

      // Gerar nome único para o arquivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = req.file.originalname.split('.').pop() || '';
      const filename = `location-${uniqueSuffix}.${ext}`;

      // Salvar nova imagem no MongoDB
      const image = await Image.create({
        filename: filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      });

      const imageId = (image as any)._id.toString();
      location.imageUrl = `/api/upload/image/${imageId}`;
    } else if (removeImage === 'true' || removeImage === true) {
      // Remover imagem do banco se existir
      if (location.imageUrl && location.imageUrl.startsWith('/api/upload/image/')) {
        const oldImageId = location.imageUrl.split('/').pop();
        if (oldImageId) {
          try {
            await Image.findByIdAndDelete(oldImageId);
          } catch (error) {
            console.warn('[Locations] Erro ao remover imagem:', error);
          }
        }
      }
      location.imageUrl = undefined;
    }

    if (req.body.schedule) {
      let schedule = req.body.schedule;
      if (typeof schedule === 'string') {
        try {
          schedule = JSON.parse(schedule);
        } catch (e) {
          schedule = [];
        }
      }
      location.schedule = schedule;
    }

    await location.save();

    res.json({ location: transformLocation(location) });
  } catch (error: any) {
    console.error('[Locations] Erro ao atualizar local:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/locations/:id
router.delete('/:id', authenticate, requireAdmin, async (req: any, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    // Remover imagem de capa do banco se existir
    if (location.imageUrl && location.imageUrl.startsWith('/api/upload/image/')) {
      const imageId = location.imageUrl.split('/').pop();
      if (imageId) {
        try {
          await Image.findByIdAndDelete(imageId);
        } catch (error) {
          console.warn('[Locations] Erro ao remover imagem de capa:', error);
        }
      }
    }

    // Remover todas as imagens da galeria do banco
    for (const img of location.images) {
      if (img.imageUrl && img.imageUrl.startsWith('/api/upload/image/')) {
        const imageId = img.imageUrl.split('/').pop();
        if (imageId) {
          try {
            await Image.findByIdAndDelete(imageId);
          } catch (error) {
            console.warn('[Locations] Erro ao remover imagem da galeria:', error);
          }
        }
      }
    }

    await Location.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[Locations] Erro ao deletar local:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/locations/:id/images - Adicionar imagens à galeria
router.post('/:id/images', authenticate, requireAdmin, upload.array('images', 20), async (req: any, res) => {
  try {
    const locationId = req.params.id;
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const newImages: any[] = [];

    for (const file of req.files) {
      if (file.buffer) {
        // Gerar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop() || '';
        const filename = `location-gallery-${uniqueSuffix}.${ext}`;

        // Salvar imagem no MongoDB
        const image = await Image.create({
          filename: filename,
          mimetype: file.mimetype,
          size: file.size,
          data: file.buffer,
        });

        const imageId = (image as any)._id.toString();
        const imageUrl = `/api/upload/image/${imageId}`;

        newImages.push({
          imageUrl,
          caption: '',
        });
      }
    }

    location.images.push(...newImages);
    await location.save();

    res.json({
      image: newImages[0] || { imageUrl: '', caption: '' }
    });
  } catch (error: any) {
    console.error('[Locations] Erro ao adicionar imagens:', error);
    res.status(500).json({ error: error.message || 'Erro ao adicionar imagens' });
  }
});

// DELETE /api/locations/:id/images/:imageIndex
router.delete('/:id/images/:imageIndex', authenticate, requireAdmin, async (req: any, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= location.images.length) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    const imageToDelete = location.images[imageIndex];

    // Remover imagem do banco se existir
    if (imageToDelete.imageUrl && imageToDelete.imageUrl.startsWith('/api/upload/image/')) {
      const imageId = imageToDelete.imageUrl.split('/').pop();
      if (imageId) {
        try {
          await Image.findByIdAndDelete(imageId);
        } catch (error) {
          console.warn('[Locations] Erro ao remover imagem do banco:', error);
        }
      }
    }

    location.images.splice(imageIndex, 1);
    await location.save();

    res.json({ success: true });
  } catch (error: any) {
    console.error('[Locations] Erro ao deletar imagem:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
