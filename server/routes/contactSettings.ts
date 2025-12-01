import { Router } from 'express';
import ContactSettings from '../models/ContactSettings';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET contact settings (público)
router.get('/', async (req, res) => {
  try {
    let settings = await ContactSettings.findOne();

    if (!settings) {
      // Criar com valores padrão se não existir
      settings = new ContactSettings({
        whatsappNumber: '9196310510',
        whatsappMessage: 'Olá, gostaria de conhecer mais sobre o projeto Dojo Dash, para usar no meu negócio.'
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações de contato' });
  }
});

// UPDATE contact settings (admin only)
router.put('/', authenticate, async (req, res) => {
  try {
    const { whatsappNumber, whatsappMessage } = req.body;

    if (!whatsappNumber || !whatsappMessage) {
      return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
    }

    let settings = await ContactSettings.findOne();

    if (!settings) {
      settings = new ContactSettings({
        whatsappNumber,
        whatsappMessage
      });
    } else {
      settings.whatsappNumber = whatsappNumber;
      settings.whatsappMessage = whatsappMessage;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar configurações de contato' });
  }
});

export default router;
