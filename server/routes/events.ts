import { Router } from 'express';
import Event from '../models/Event.js';
import { authenticate as authenticateToken } from '../middleware/auth.js';

const router = Router();

// Helper para transformar _id em id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformEvent = (event: any) => {
  const obj = event.toObject ? event.toObject() : event;
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    date: obj.date,
    imageUrl: obj.imageUrl,
    registrationPrice: obj.registrationPrice,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registeredStudents: obj.registeredStudents?.map((id: any) => id.toString()) || [],
    registeredCount: obj.registeredStudents?.length || 0,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// GET /api/events - Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ events: events.map(transformEvent) });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id - Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({ event: transformEvent(event) });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events - Criar evento (apenas admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Verificar se é admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((req as any).user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem criar eventos.' });
    }

    const { title, description, date, imageUrl, registrationPrice } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Título e data são obrigatórios' });
    }

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      imageUrl,
      registrationPrice: registrationPrice ? parseFloat(registrationPrice) : undefined,
      registeredStudents: [],
    });

    res.status(201).json({ event: transformEvent(event) });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/events/:id - Atualizar evento (apenas admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar se é admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((req as any).user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem editar eventos.' });
    }

    const { title, description, date, imageUrl, registrationPrice } = req.body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(date && { date: new Date(date) }),
      ...(imageUrl !== undefined && { imageUrl }),
    };

    // Se registrationPrice for fornecido, converter para número ou undefined se vazio
    if (registrationPrice !== undefined) {
      updateData.registrationPrice = registrationPrice === '' || registrationPrice === null ? undefined : parseFloat(registrationPrice);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({ event: transformEvent(event) });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/events/:id - Deletar evento (apenas admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar se é admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((req as any).user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem deletar eventos.' });
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/register - Registrar presença no evento
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Verificar se já está registrado
    if (event.registeredStudents.includes(userId)) {
      return res.status(400).json({ error: 'Você já está registrado neste evento' });
    }

    // Adicionar usuário à lista de registrados
    event.registeredStudents.push(userId);
    await event.save();

    res.json({ event: transformEvent(event), message: 'Presença confirmada com sucesso!' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/unregister - Cancelar registro no evento
router.post('/:id/unregister', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Verificar se está registrado
    if (!event.registeredStudents.includes(userId)) {
      return res.status(400).json({ error: 'Você não está registrado neste evento' });
    }

    // Remover usuário da lista de registrados
    event.registeredStudents = event.registeredStudents.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (id: any) => id.toString() !== userId.toString()
    );
    await event.save();

    res.json({ event: transformEvent(event), message: 'Registro cancelado com sucesso!' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

export default router;

