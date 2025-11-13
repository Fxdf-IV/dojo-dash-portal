import { apiRequest } from './api';
import type { Contact } from '@/types';

interface ContactsResponse {
  contacts: Contact[];
}

interface ContactResponse {
  contact: Contact;
  success?: boolean;
  message?: string;
}

export const contactsService = {
  async create(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<ContactResponse> {
    return await apiRequest<ContactResponse>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAll(status?: string): Promise<Contact[]> {
    const query = status ? `?status=${status}` : '';
    const response = await apiRequest<ContactsResponse>(`/contacts${query}`, {
      requireAuth: true,
    });

    return response.contacts;
  },

  async updateStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<Contact> {
    const response = await apiRequest<ContactResponse>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      requireAuth: true,
    });

    return response.contact;
  },
};
