import { Router } from 'express';
import Sensei from '../models/Sensei.js';

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
    const senseis = await Sensei.find().sort({ orderIndex: 1 });
    res.json({ senseis: senseis.map(transformSensei) });
  } catch (error: any) {
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
router.post('/', async (req, res) => {
  try {
    const { name, rank, description, imageUrl, orderIndex } = req.body;

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
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/senseis/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, rank, description, imageUrl, orderIndex } = req.body;

    const sensei = await Sensei.findByIdAndUpdate(
      req.params.id,
      { name, rank, description, imageUrl, orderIndex },
      { new: true, runValidators: true }
    );

    if (!sensei) {
      return res.status(404).json({ error: 'Sensei não encontrado' });
    }

    res.json({ sensei: transformSensei(sensei) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/senseis/:id
router.delete('/:id', async (req, res) => {
  try {
    const sensei = await Sensei.findByIdAndDelete(req.params.id);

    if (!sensei) {
      return res.status(404).json({ error: 'Sensei não encontrado' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
