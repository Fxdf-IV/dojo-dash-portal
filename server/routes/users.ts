import { Router } from 'express';
import User from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Todas as rotas requerem autenticação e permissão de admin
router.use(authenticate, requireAdmin);

// GET /api/users - Listar usuários (filtrar por role se necessário)
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const query: any = {};
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({ users: formattedUsers });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Criar novo usuário (admin)
router.post('/', async (req, res) => {
  try {
    const { name, email, username, password, role, location } = req.body;

    // Validar campos obrigatórios (email ou username)
    if ((!email && !username) || !password) {
      return res.status(400).json({ error: 'Email/Username e senha são obrigatórios' });
    }

    // Verificar se usuário já existe (email ou username)
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Nome de usuário já cadastrado' });
      }
    }

    const user = await User.create({
      name,
      email,
      username,
      password,
      role: role || 'admin',
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, username, password, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Se email mudou, verificar duplicidade
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      user.email = email;
    }

    // Se username mudou, verificar duplicidade
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Nome de usuário já cadastrado' });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (role) user.role = role;

    await user.save();

    res.json({
      message: 'Usuário atualizado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Remover usuário
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Não permitir deletar a si mesmo
    const authReq = req as any;
    if (authReq.user._id.toString() === id) {
      return res.status(400).json({ error: 'Não é possível remover seu próprio usuário' });
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
