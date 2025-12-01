import { Sensei } from '@/types';
import { mockSenseis } from '../../mocks/data';

export const senseisService = {
  async getAll(): Promise<Sensei[]> {
    return Promise.resolve([...mockSenseis]);
  },

  async getById(id: string): Promise<Sensei> {
    const sensei = mockSenseis.find(s => s.id === id);
    if (!sensei) {
      throw new Error('Sensei not found');
    }
    return Promise.resolve({ ...sensei });
  },

  async create(data: Partial<Sensei> | FormData): Promise<Sensei> {
    console.log('Mock create sensei:', data);
    const newSensei: Sensei = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Sensei (Mock)',
      rank: '1º Dan',
      orderIndex: mockSenseis.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...((data instanceof FormData ? {} : data) as any)
    };
    return Promise.resolve(newSensei);
  },

  async update(id: string, data: Partial<Sensei> | FormData): Promise<Sensei> {
    console.log('Mock update sensei:', id, data);
    const sensei = mockSenseis.find(s => s.id === id);
    if (!sensei) {
      throw new Error('Sensei not found');
    }
    return Promise.resolve({ ...sensei, name: sensei.name + ' (Updated)' });
  },

  async delete(id: string): Promise<void> {
    console.log('Mock delete sensei:', id);
    return Promise.resolve();
  },

  async reorderSenseis(senseis: Sensei[]): Promise<void> {
    console.log('Mock reorder senseis:', senseis);
    return Promise.resolve();
  },

  async deleteImage(id: string, imageIndex: number): Promise<void> {
    console.log('Mock delete image:', id, imageIndex);
    return Promise.resolve();
  },

  async removeSenseiImage(id: string): Promise<Sensei> {
    console.log('Mock remove sensei image:', id);
    const sensei = mockSenseis.find(s => s.id === id);
    if (!sensei) {
      throw new Error('Sensei not found');
    }
    return Promise.resolve({ ...sensei, imageUrl: undefined });
  },
};
