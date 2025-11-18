import { apiRequest } from './api';
import { uploadService } from './upload';
import type { Sensei } from '@/types';

interface SenseisResponse {
  senseis: Sensei[];
}

interface SenseiResponse {
  sensei: Sensei;
}

export const senseisService = {
  async getAll(): Promise<Sensei[]> {
    const response = await apiRequest<SenseisResponse>('/senseis');
    return response.senseis;
  },

  async getById(id: string): Promise<Sensei> {
    const response = await apiRequest<SenseiResponse>(`/senseis/${id}`);
    return response.sensei;
  },

  async create(data: Partial<Sensei> | FormData): Promise<Sensei> {
    if (data instanceof FormData) {
      // Extrair dados do FormData
      const senseiData: Partial<Sensei> = {
        name: data.get('name') as string,
        rank: data.get('rank') as string,
        description: data.get('description') as string || undefined,
        orderIndex: parseInt(data.get('orderIndex') as string) || 0,
      };

      // Upload de imagem se existir
      const imageFile = data.get('image') as File;
      if (imageFile) {
        senseiData.imageUrl = await uploadService.uploadImage(imageFile);
      }

      return this.create(senseiData);
    }

    const response = await apiRequest<SenseiResponse>('/senseis', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.sensei;
  },

  async update(id: string, data: Partial<Sensei> | FormData): Promise<Sensei> {
    if (data instanceof FormData) {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const url = `${API_BASE_URL}/senseis/${id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar sensei');
      }

      const result = await response.json();
      return result.sensei;
    }

    const response = await apiRequest<SenseiResponse>(`/senseis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.sensei;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/senseis/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async reorderSenseis(senseis: Sensei[]): Promise<void> {
    await apiRequest('/senseis/reorder', {
      method: 'PUT',
      body: JSON.stringify({ senseis }),
      requireAuth: true,
    });
  },

  async deleteImage(id: string, imageIndex: number): Promise<void> {
    await apiRequest(`/senseis/${id}/images/${imageIndex}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async removeSenseiImage(id: string): Promise<Sensei> {
    const fd = new FormData();
    fd.append('removeImage', 'true');

    return this.update(id, fd);
  },
};
