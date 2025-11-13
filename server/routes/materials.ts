import { Router } from 'express';
import Material from '../models/Material.js';

const router = Router();

// Helper para transformar _id em id
const transformMaterial = (material: any) => {
  const obj = material.toObject ? material.toObject() : material;
  return {
    id: obj._id.toString(),
    title: obj.title,
    type: obj.type,
    description: obj.description,
    content: obj.content,
    videoUrl: obj.videoUrl,
    imageUrl: obj.imageUrl,
    minBeltId: obj.minBeltId, // Mudança: usar minBeltId
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// GET /api/materials
router.get('/', async (req, res) => {
  try {
    const { type, min_belt_id } = req.query;

    const filter: any = {};
    if (type) filter.type = type;
    // Removido filtro por min_kyu - será feito no frontend com lógica correta

    const materials = await Material.find(filter).sort({ createdAt: -1 });

    res.json({ materials: materials.map(transformMaterial) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/materials/:id
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }

    res.json({ material: transformMaterial(material) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/materials
router.post('/', async (req, res) => {
  try {
    const { title, type, description, content, videoUrl, imageUrl, minBeltId } = req.body;

    const material = await Material.create({
      title,
      type,
      description,
      content,
      videoUrl,
      imageUrl,
      minBeltId,
    });

    res.json({ material: transformMaterial(material) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/materials/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, type, description, content, videoUrl, imageUrl, minBeltId } = req.body;

    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { title, type, description, content, videoUrl, imageUrl, minBeltId },
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }

    res.json({ material: transformMaterial(material) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/materials/:id
router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({ error: 'Material não encontrado' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
