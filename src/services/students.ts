import { apiRequest } from './api';
import type { Student } from '@/types';

interface StudentsResponse {
  students: Student[];
}

interface StudentResponse {
  student: Student;
}

export const studentsService = {
  async getAll(filters?: { status?: string; location?: string }): Promise<Student[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.location) params.append('location', filters.location);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest<StudentsResponse>(`/students${query}`, {
      requireAuth: true,
    });

    return response.students;
  },

  async getById(id: string): Promise<Student> {
    const response = await apiRequest<StudentResponse>(`/students/${id}`, {
      requireAuth: true,
    });

    return response.student;
  },

  async create(data: Partial<Student>): Promise<Student> {
    const response = await apiRequest<StudentResponse>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.student;
  },

  async update(id: string, data: Partial<Student>): Promise<Student> {
    const response = await apiRequest<StudentResponse>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.student;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/students/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async approveStudent(id: string): Promise<Student> {
    return this.update(id, { status: 'active' });
  },

  async rejectStudent(id: string): Promise<Student> {
    return this.update(id, { status: 'inactive' });
  },
};
