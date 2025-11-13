import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { generateToken } from '../utils/jwt.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken((user._id as any).toString());

    // Buscar dados do aluno se for student
    let userData: any = {
      id: user._id as any,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        userData.name = student.name;
        userData.beltId = student.beltId;
        userData.location = student.location;
      }
    } else {
      // Admin tem nome fixo
      userData.name = 'Administrador';
    }

    res.json({
      user: userData,
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, beltId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const user = await User.create({
      email,
      password,
      role: 'student',
    });

    const student = await Student.create({
      userId: user._id,
      name,
      email,
      beltId: beltId || 'white',
      location,
      status: 'pending',
    });

    const token = generateToken((user._id as any).toString());

    res.json({
      message: 'Cadastro realizado! Aguarde aprovação do administrador.',
      user: {
        id: user._id as any,
        name: student.name,
        email: user.email,
        role: user.role,
        beltId: student.beltId,
        location: student.location,
      },
      token,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  res.json({ success: true });
});

// GET /api/auth/me - Buscar dados atualizados do usuário
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Buscar dados do aluno se for student
    let userData: any = {
      id: user._id as any,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        userData.name = student.name;
        userData.beltId = student.beltId;
        userData.location = student.location;
      }
    } else {
      userData.name = 'Administrador';
    }

    res.json({ user: userData });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;
