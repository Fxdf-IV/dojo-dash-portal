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

  async create(data: Partial<Location>): Promise<Location> {
    const response = await apiRequest<LocationResponse>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.location;
  },

  async update(id: string, data: Partial<Location>): Promise<Location> {
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

  async addImage(locationId: string, image: LocationImage): Promise<LocationImage> {
    const response = await apiRequest<ImageResponse>(`/locations/${locationId}/images`, {
      method: 'POST',
      body: JSON.stringify(image),
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
};
