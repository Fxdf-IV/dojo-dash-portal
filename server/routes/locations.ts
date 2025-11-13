import { Router } from 'express';
import Location from '../models/Location.js';

const router = Router();

// Helper para transformar _id em id
const transformLocation = (location: any) => {
  const obj = location.toObject ? location.toObject() : location;
  return {
    id: obj._id.toString(),
    name: obj.name,
    description: obj.description,
    imageUrl: obj.imageUrl,
    images: obj.images?.map((img: any) => ({
      imageUrl: img.imageUrl,
      caption: img.caption,
    })) || [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// GET /api/locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json({ locations: locations.map(transformLocation) });
  } catch (error: any) {
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

// POST /api/locations
router.post('/', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    const location = await Location.create({
      name,
      description,
      imageUrl,
      images: [],
    });

    res.json({ location: transformLocation(location) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/locations/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl },
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    res.json({ location: transformLocation(location) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/locations/:id
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/locations/:id/images
router.post('/:id/images', async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    location.images.push({ imageUrl, caption });
    await location.save();

    const newImage = location.images[location.images.length - 1];
    res.json({
      image: {
        imageUrl: newImage.imageUrl,
        caption: newImage.caption,
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/locations/:id/images/:imageIndex
router.delete('/:id/images/:imageIndex', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= location.images.length) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    location.images.splice(imageIndex, 1);
    await location.save();

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
