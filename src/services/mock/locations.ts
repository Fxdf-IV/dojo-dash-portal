import { Location, LocationImage } from '@/types';
import { mockLocations } from '../../mocks/data';

export const locationsService = {
  async getAll(): Promise<Location[]> {
    return Promise.resolve([...mockLocations]);
  },

  async getById(id: string): Promise<Location> {
    const location = mockLocations.find(l => l.id === id);
    if (!location) {
      throw new Error('Location not found');
    }
    return Promise.resolve({ ...location });
  },

  async create(data: Partial<Location> | FormData): Promise<Location> {
    console.log('Mock create location:', data);
    const newLocation: Location = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nova Unidade (Mock)',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...((data instanceof FormData ? {} : data) as any)
    };
    return Promise.resolve(newLocation);
  },

  async update(id: string, data: Partial<Location> | FormData): Promise<Location> {
    console.log('Mock update location:', id, data);
    const location = mockLocations.find(l => l.id === id);
    if (!location) {
      throw new Error('Location not found');
    }
    return Promise.resolve({ ...location, name: location.name + ' (Updated)' });
  },

  async delete(id: string): Promise<void> {
    console.log('Mock delete location:', id);
    return Promise.resolve();
  },

  async addImage(locationId: string, imageData: LocationImage | FormData): Promise<LocationImage> {
    console.log('Mock add image:', locationId, imageData);
    return Promise.resolve({
      imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
      caption: 'Mock Image'
    });
  },

  async deleteImage(locationId: string, imageIndex: number): Promise<void> {
    console.log('Mock delete image:', locationId, imageIndex);
    return Promise.resolve();
  },

  async reorderLocations(locations: Location[]): Promise<void> {
    console.log('Mock reorder locations:', locations);
    return Promise.resolve();
  },

  async removeCoverImage(id: string, name: string, description: string, mapUrl: string): Promise<Location> {
    console.log('Mock remove cover image:', id);
    const location = mockLocations.find(l => l.id === id);
    if (!location) {
      throw new Error('Location not found');
    }
    return Promise.resolve({ ...location, imageUrl: undefined });
  },
};
