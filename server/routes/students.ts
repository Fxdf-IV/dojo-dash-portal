import { Router } from 'express';
import Student from '../models/Student.js';
import User from '../models/User.js';

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
router.get('/', async (req, res) => {
  try {
    const { status, location } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (location) filter.location = location;

    const students = await Student.find(filter).sort({ createdAt: -1 });

    res.json({ students: students.map(transformStudent) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({ student: transformStudent(student) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/students
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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

    let userRecord = await User.findById(student.userId);
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
router.delete('/:id', async (req, res) => {
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
