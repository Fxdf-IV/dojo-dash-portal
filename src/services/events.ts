import { apiRequest } from './api';
import type { Event } from '@/types';

interface EventsResponse {
  events: Event[];
}

interface EventResponse {
  event: Event;
}

export const eventsService = {
  async getAll(): Promise<Event[]> {
    const response = await apiRequest<EventsResponse>('/events');
    return response.events;
  },

  async getById(id: string): Promise<Event> {
    const response = await apiRequest<EventResponse>(`/events/${id}`);
    return response.event;
  },

  async create(data: Partial<Event>): Promise<Event> {
    const response = await apiRequest<EventResponse>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.event;
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const response = await apiRequest<EventResponse>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.event;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/events/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async register(eventId: string): Promise<Event> {
    const response = await apiRequest<EventResponse>(`/events/${eventId}/register`, {
      method: 'POST',
      requireAuth: true,
    });

    return response.event;
  },

  async unregister(eventId: string): Promise<Event> {
    const response = await apiRequest<EventResponse>(`/events/${eventId}/unregister`, {
      method: 'POST',
      requireAuth: true,
    });

    return response.event;
  },
};

