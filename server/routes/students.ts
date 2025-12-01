import { Router } from 'express';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

const parseDate = (value?: string | Date) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

// Helper para transformar _id em id
const transformStudent = (student: any) => {
  const obj = student.toObject ? student.toObject() : student;
  return {
    id: obj._id.toString(),
    userId: obj.userId?.toString?.() ?? obj.userId,
    name: obj.name,
    email: obj.email,
    birthDate: obj.birthDate,
    phone: obj.phone,
    startDate: obj.startDate,
    beltId: obj.beltId,
    location: obj.location,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// GET /api/students
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, location } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (location) filter.location = location;

    // Se não for admin, só pode ver a si mesmo (embora a listagem geralmente seja para admins/senseis)
    // Por enquanto, vamos permitir que alunos vejam lista mas talvez filtrar dados sensíveis?
    // Melhor: apenas admin vê tudo. Aluno vê apenas seu próprio registro via /me ou /:id

    if (req.user.role !== 'admin') {
      // Se não for admin, retorna apenas o próprio aluno se coincidir com filtro, ou erro
      // Mas para simplificar e seguir o padrão de segurança:
      // Listagem geral = Apenas Admin
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });

    res.json({ students: students.map(transformStudent) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:id
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Verificação de permissão: Admin ou o próprio aluno
    const isOwner = student.userId.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    res.json({ student: transformStudent(student) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/students
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      beltId,
      location,
      status,
      birthDate,
      phone,
      startDate,
      password,
    } = req.body;

    if (!name || !email || !location) {
      return res.status(400).json({ error: 'Nome, email e local são obrigatórios' });
    }

    let resolvedUserId = userId;
    let userRecord = null;

    if (resolvedUserId) {
      userRecord = await User.findById(resolvedUserId);
      if (!userRecord) {
        return res.status(404).json({ error: 'Usuário associado não encontrado' });
      }
      if (password) {
        userRecord.password = password;
        await userRecord.save();
      }
    } else {
      userRecord = await User.findOne({ email });

      if (userRecord) {
        resolvedUserId = userRecord._id;
        if (password) {
          userRecord.password = password;
          await userRecord.save();
        }
      } else {
        if (!password) {
          return res.status(400).json({ error: 'Senha é obrigatória para criar um novo aluno' });
        }

        userRecord = await User.create({
          email,
          password,
          role: 'student',
        });
        resolvedUserId = userRecord._id;
      }
    }

    if (!resolvedUserId) {
      return res.status(400).json({ error: 'Não foi possível determinar o usuário associado' });
    }

    const student = await Student.create({
      userId: resolvedUserId,
      name,
      email,
      beltId: beltId || 'white',
      location,
      status: status || 'pending',
      birthDate: parseDate(birthDate),
      phone: phone || undefined,
      startDate: parseDate(startDate),
    });

    res.json({ student: transformStudent(student) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/students/:id
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      email,
      beltId,
      location,
      status,
      birthDate,
      phone,
      startDate,
      password,
    } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Verificação de permissão: Admin ou o próprio aluno
    const isOwner = student.userId.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Alunos não podem alterar certos campos
    if (!isOwner && req.user.role !== 'admin') {
      // Redundante com o check acima, mas para clareza:
      // Se fosse permitir edição parcial, aqui bloqueariamos campos sensíveis.
      // Como permitimos edição, vamos restringir o que o aluno pode mudar?
      // Por enquanto, manteremos a lógica original mas protegida por auth.
      // TODO: Refinar quais campos o aluno pode editar (ex: não pode mudar beltId ou status)
    }

    // Se for aluno editando a si mesmo, impedir alteração de status, beltId, location (exceto se admin)
    if (isOwner && req.user.role !== 'admin') {
      if (beltId && beltId !== student.beltId) return res.status(403).json({ error: 'Alunos não podem alterar sua própria faixa.' });
      if (status && status !== student.status) return res.status(403).json({ error: 'Alunos não podem alterar seu próprio status.' });
      // Location talvez seja permitido mudar? Vamos bloquear por segurança.
      if (location && location !== student.location) return res.status(403).json({ error: 'Alunos não podem alterar seu dojo.' });
    }

    const userRecord = await User.findById(student.userId);
    if (!userRecord) {
      return res.status(404).json({ error: 'Usuário associado não encontrado' });
    }

    if (name !== undefined) student.name = name;
    if (beltId !== undefined) student.beltId = beltId;
    if (location !== undefined) student.location = location;
    if (status !== undefined) student.status = status;
    if (birthDate !== undefined) {
      student.birthDate = birthDate ? parseDate(birthDate) : undefined;
    }
    if (phone !== undefined) {
      student.phone = phone || undefined;
    }
    if (startDate !== undefined) {
      student.startDate = startDate ? parseDate(startDate) : undefined;
    }

    let shouldUpdateUser = false;

    if (email !== undefined && email !== student.email) {
      const emailInUse = await User.findOne({ email, _id: { $ne: student.userId } });
      if (emailInUse) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      student.email = email;
      userRecord.email = email;
      shouldUpdateUser = true;
    }

    if (password) {
      userRecord.password = password;
      shouldUpdateUser = true;
    }

    if (shouldUpdateUser) {
      await userRecord.save();
    }

    await student.save();

    res.json({ student: transformStudent(student) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const user = await User.findByIdAndDelete(student.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.deleteOne();

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
