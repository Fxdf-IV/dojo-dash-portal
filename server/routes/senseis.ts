import { Router } from 'express';
import multer from 'multer';
import Sensei from '../models/Sensei.js';
import Image from '../models/Image.js';
import { authenticate } from '../middleware/auth.js';

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

const router = Router();

// Helper para transformar _id em id
const transformSensei = (sensei: any) => {
  const obj = sensei.toObject ? sensei.toObject() : sensei;
  return {
    id: obj._id.toString(),
    name: obj.name,
    rank: obj.rank,
    description: obj.description,
    imageUrl: obj.imageUrl,
    orderIndex: obj.orderIndex,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// GET /api/senseis
router.get('/', async (req, res) => {
  try {
    const senseis = await Sensei.find().sort({ orderIndex: 1, createdAt: -1 });
    res.json({ senseis: senseis.map(transformSensei) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/senseis/reorder - Atualizar ordem dos senseis
router.put('/reorder', authenticate, async (req: any, res) => {
  try {
    const { senseis: senseisOrder } = req.body;

    if (!Array.isArray(senseisOrder)) {
      return res.status(400).json({ error: 'Formato de reorder inválido' });
    }

    // Atualizar orderIndex para cada sensei
    for (let i = 0; i < senseisOrder.length; i++) {
      await Sensei.findByIdAndUpdate(
        senseisOrder[i].id,
        { orderIndex: i },
        { new: true }
      );
    }

    res.json({ success: true, message: 'Ordem atualizada com sucesso' });
  } catch (error: any) {
    console.error('[Senseis] Erro ao reordenar:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/senseis/:id
router.get('/:id', async (req, res) => {
  try {
    const sensei = await Sensei.findById(req.params.id);

    if (!sensei) {
      return res.status(404).json({ error: 'Sensei não encontrado' });
    }

    res.json({ sensei: transformSensei(sensei) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/senseis
router.post('/', authenticate, upload.single('image'), async (req: any, res) => {
  try {
    const { name, rank, description, orderIndex } = req.body;

    let imageUrl = undefined;
    if (req.file && req.file.buffer) {
      // Gerar nome único para o arquivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = req.file.originalname.split('.').pop() || '';
      const filename = `sensei-${uniqueSuffix}.${ext}`;

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

    const count = await Sensei.countDocuments();

    const sensei = await Sensei.create({
      name,
      rank,
      description,
      imageUrl,
      orderIndex: orderIndex !== undefined ? orderIndex : count,
    });

    res.json({ sensei: transformSensei(sensei) });
  } catch (error: any) {
    console.error('[Senseis] Erro ao criar sensei:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/senseis/:id
router.put('/:id', authenticate, upload.single('image'), async (req: any, res) => {
  try {
    const { name, rank, description, removeImage } = req.body;

    const sensei = await Sensei.findById(req.params.id);
    if (!sensei) {
      return res.status(404).json({ error: 'Sensei não encontrado' });
    }

    const shouldRemoveImage = removeImage === 'true' || removeImage === true;
    const updateQuery: any = {};
    const setData: any = {};
    const unsetData: any = {};

    if (name !== undefined) setData.name = name;
    if (rank !== undefined) setData.rank = rank;
    if (description !== undefined) setData.description = description;

    if (req.file && req.file.buffer) {
      // Remover imagem anterior do banco se existir
      if (sensei.imageUrl && sensei.imageUrl.startsWith('/api/upload/image/')) {
        const oldImageId = sensei.imageUrl.split('/').pop();
        if (oldImageId) {
          try {
            await Image.findByIdAndDelete(oldImageId);
          } catch (error) {
            console.warn('[Senseis] Erro ao remover imagem anterior:', error);
          }
        }
      }

      // Gerar nome único para o arquivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = req.file.originalname.split('.').pop() || '';
      const filename = `sensei-${uniqueSuffix}.${ext}`;

      // Salvar nova imagem no MongoDB
      const image = await Image.create({
        filename: filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      });

      const imageId = (image as any)._id.toString();
      setData.imageUrl = `/api/upload/image/${imageId}`;
    } else if (shouldRemoveImage) {
      // Remover imagem do banco se existir
      if (sensei.imageUrl && sensei.imageUrl.startsWith('/api/upload/image/')) {
        const oldImageId = sensei.imageUrl.split('/').pop();
        if (oldImageId) {
          try {
            await Image.findByIdAndDelete(oldImageId);
          } catch (error) {
            console.warn('[Senseis] Erro ao remover imagem:', error);
          }
        }
      }
      unsetData.imageUrl = '';
    }

    if (Object.keys(setData).length > 0) {
      updateQuery.$set = setData;
    }

    if (Object.keys(unsetData).length > 0) {
      updateQuery.$unset = unsetData;
    }

    if (!updateQuery.$set && !updateQuery.$unset) {
      return res.json({ sensei: transformSensei(sensei) });
    }

    const updated = await Sensei.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Sensei não encontrado' });
    }

    res.json({ sensei: transformSensei(updated) });
  } catch (error: any) {
    console.error('[Senseis] Erro ao atualizar sensei:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/senseis/:id
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const sensei = await Sensei.findById(req.params.id);

    if (!sensei) {
      return res.status(404).json({ error: 'Sensei não encontrado' });
    }

    // Remover imagem do banco se existir
    if (sensei.imageUrl && sensei.imageUrl.startsWith('/api/upload/image/')) {
      const imageId = sensei.imageUrl.split('/').pop();
      if (imageId) {
        try {
          await Image.findByIdAndDelete(imageId);
        } catch (error) {
          console.warn('[Senseis] Erro ao remover imagem:', error);
        }
      }
    }

    await Sensei.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[Senseis] Erro ao deletar sensei:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;