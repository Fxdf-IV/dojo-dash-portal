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

    // Tentar encontrar por email OU username
    const user = await User.findOne({
      $or: [
        { email: email },
        { username: email } // O campo 'email' do body pode conter o username
      ]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken((user._id as any).toString());

    // Buscar dados do aluno se for student
    const userData: any = {
      id: user._id as any,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        userData.name = student.name;
        userData.beltId = student.beltId;
        userData.location = student.location;
        userData.status = student.status;
      }
    } else {
      // Admin pode ter nome salvo no User
      userData.name = user.name || 'Administrador';
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

    res.status(201).json({
      message: 'Cadastro realizado! Aguarde aprovação do administrador.',
      user: {
        id: user._id as any,
        name: student.name,
        email: user.email,
        role: user.role,
        beltId: student.beltId,
        location: student.location,
        status: student.status,
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

// POST /api/auth/request-password-reset
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Email não cadastrado' });
    }

    // Se for aluno, mudar status para pending
    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        student.status = 'pending';
        await student.save();
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Request password reset error:', error);
    res.status(500).json({ error: error.message });
  }
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
    const userData: any = {
      id: user._id as any,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        userData.name = student.name;
        userData.beltId = student.beltId;
        userData.location = student.location;
        userData.status = student.status;
      }
    } else {
      userData.name = user.name || 'Administrador';
    }

    res.json({ user: userData });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;
