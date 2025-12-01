import { Student } from '@/types';
import { mockStudents } from '@/mocks/data';

export const studentsService = {
  async getAll(): Promise<Student[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStudents;
  },

  async getById(id: string): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return student;
  },

  async create(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStudent: Student = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  async update(id: string, data: Partial<Student>): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    
    mockStudents[index] = { ...mockStudents[index], ...data, updatedAt: new Date().toISOString() };
    return mockStudents[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStudents.findIndex(s => s.id === id);
    if (index !== -1) {
      mockStudents.splice(index, 1);
    }
  }
};
