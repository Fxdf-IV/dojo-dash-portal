import { Router } from 'express';
import Contact from '../models/Contact.js';

const router = Router();

// POST /api/contacts
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject: subject || 'Contato via site',
      message,
      status: 'new',
    });

    console.log('📧 Nova mensagem de contato:');
    console.log(`   Nome: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Assunto: ${subject}`);
    console.log(`   Mensagem: ${message}`);

    res.json({
      success: true,
      message: 'Mensagem recebida! Entraremos em contato em breve.',
      contact,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contacts - listar mensagens (para admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/contacts/:id - atualizar status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    res.json({ contact });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
