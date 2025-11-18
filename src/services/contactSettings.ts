import { apiRequest } from './api';

export interface ContactSettings {
  id: string;
  whatsappNumber: string;
  whatsappMessage: string;
  createdAt?: string;
  updatedAt?: string;
}

class ContactSettingsService {
  async getSettings(): Promise<ContactSettings> {
    return apiRequest<ContactSettings>('/contact-settings');
  }

  async updateSettings(whatsappNumber: string, whatsappMessage: string): Promise<ContactSettings> {
    return apiRequest<ContactSettings>('/contact-settings', {
      method: 'PUT',
      body: JSON.stringify({ whatsappNumber, whatsappMessage }),
      requireAuth: true,
    });
  }
}

export const contactSettingsService = new ContactSettingsService();
