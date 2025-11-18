import { apiRequest } from './api';
import type { Location, LocationImage } from '@/types';

interface LocationsResponse {
  locations: Location[];
}

interface LocationResponse {
  location: Location;
}

interface ImageResponse {
  image: LocationImage;
}

export const locationsService = {
  async getAll(): Promise<Location[]> {
    const response = await apiRequest<LocationsResponse>('/locations');
    return response.locations;
  },

  async getById(id: string): Promise<Location> {
    const response = await apiRequest<LocationResponse>(`/locations/${id}`);
    return response.location;
  },

  async create(data: Partial<Location> | FormData): Promise<Location> {
    if (data instanceof FormData) {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const url = `${API_BASE_URL}/locations`;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar local');
      }

      const result = await response.json();
      return result.location;
    }

    const response = await apiRequest<LocationResponse>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.location;
  },

  async update(id: string, data: Partial<Location> | FormData): Promise<Location> {
    if (data instanceof FormData) {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const url = `${API_BASE_URL}/locations/${id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar local');
      }

      const result = await response.json();
      return result.location;
    }

    const response = await apiRequest<LocationResponse>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.location;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/locations/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async addImage(locationId: string, imageData: LocationImage | FormData): Promise<LocationImage> {
    if (imageData instanceof FormData) {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const url = `${API_BASE_URL}/locations/${locationId}/images`;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: imageData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao adicionar imagem');
      }

      const result = await response.json();
      return result.image;
    }

    const response = await apiRequest<ImageResponse>(`/locations/${locationId}/images`, {
      method: 'POST',
      body: JSON.stringify(imageData),
      requireAuth: true,
    });

    return response.image;
  },

  async deleteImage(locationId: string, imageIndex: number): Promise<void> {
    await apiRequest(`/locations/${locationId}/images/${imageIndex}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async reorderLocations(locations: Location[]): Promise<void> {
    await apiRequest(`/locations/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ locations }),
      requireAuth: true,
    });
  },

  async removeCoverImage(id: string, name: string, description: string): Promise<Location> {
    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', description || '');
    fd.append('removeImage', 'true');

    return this.update(id, fd);
  },
};

