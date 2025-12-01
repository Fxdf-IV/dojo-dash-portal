import { Material } from '@/types';
import { mockMaterials } from '@/mocks/data';

export const materialsService = {
  async getAll(): Promise<Material[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMaterials;
  },

  async getById(id: string): Promise<Material> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const material = mockMaterials.find(m => m.id === id);
    if (!material) throw new Error('Material not found');
    return material;
  },

  async getByBelt(beltId: string): Promise<Material[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Simple filter logic, in real app it might be more complex with belt hierarchy
    return mockMaterials.filter(m => m.minBeltId === beltId || beltId === 'all');
  },

  async create(data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>): Promise<Material> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMaterial: Material = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMaterials.push(newMaterial);
    return newMaterial;
  },

  async update(id: string, data: Partial<Material>): Promise<Material> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMaterials.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Material not found');
    
    mockMaterials[index] = { ...mockMaterials[index], ...data, updatedAt: new Date().toISOString() };
    return mockMaterials[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMaterials.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMaterials.splice(index, 1);
    }
  }
};
