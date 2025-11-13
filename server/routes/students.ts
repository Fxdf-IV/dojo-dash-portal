import { Router } from 'express';
import Student from '../models/Student.js';
import User from '../models/User.js';

const router = Router();

// Helper para transformar _id em id
const transformStudent = (student: any) => {
  const obj = student.toObject ? student.toObject() : student;
  return {
    id: obj._id.toString(),
    userId: obj.userId.toString(),
    name: obj.name,
    email: obj.email,
    birthDate: obj.birthDate,
    phone: obj.phone,
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
    const { userId, name, email, beltId, location, status } = req.body;

    const student = await Student.create({
      userId,
      name,
      email,
      beltId: beltId || 'white',
      location,
      status: status || 'pending',
    });

    res.json({ student: transformStudent(student) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/students/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, email, beltId, location, status } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, beltId, location, status },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

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
