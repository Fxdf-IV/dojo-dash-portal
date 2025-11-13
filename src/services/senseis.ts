import { apiRequest } from './api';
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

  async create(data: Partial<Sensei>): Promise<Sensei> {
    const response = await apiRequest<SenseiResponse>('/senseis', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.sensei;
  },

  async update(id: string, data: Partial<Sensei>): Promise<Sensei> {
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
};
