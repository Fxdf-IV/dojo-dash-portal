import { apiRequest } from './api';
import type { Material } from '@/types';

interface MaterialsResponse {
  materials: Material[];
}

interface MaterialResponse {
  material: Material;
}

export const materialsService = {
  async getAll(filters?: { type?: string; min_kyu?: number }): Promise<Material[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.min_kyu) params.append('min_kyu', filters.min_kyu.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest<MaterialsResponse>(`/materials${query}`, {
      requireAuth: true,
    });

    return response.materials;
  },

  async getById(id: string): Promise<Material> {
    const response = await apiRequest<MaterialResponse>(`/materials/${id}`, {
      requireAuth: true,
    });

    return response.material;
  },

  async create(data: Partial<Material>): Promise<Material> {
    const response = await apiRequest<MaterialResponse>('/materials', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.material;
  },

  async update(id: string, data: Partial<Material>): Promise<Material> {
    const response = await apiRequest<MaterialResponse>(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.material;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/materials/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
