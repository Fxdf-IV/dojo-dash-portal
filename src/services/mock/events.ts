import { Event } from '@/types';
import { mockEvents } from '../../mocks/data';

export const eventsService = {
  async getAll(): Promise<Event[]> {
    return Promise.resolve([...mockEvents]);
  },

  async getById(id: string): Promise<Event> {
    const event = mockEvents.find(e => e.id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    return Promise.resolve({ ...event });
  },

  async create(data: Partial<Event> | FormData): Promise<Event> {
    console.log('Mock create event:', data);
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Novo Evento (Mock)',
      date: new Date().toISOString(),
      registeredStudents: [],
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...((data instanceof FormData ? {} : data) as any)
    };
    return Promise.resolve(newEvent);
  },

  async update(id: string, data: Partial<Event> | FormData): Promise<Event> {
    console.log('Mock update event:', id, data);
    const event = mockEvents.find(e => e.id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    return Promise.resolve({ ...event, title: event.title + ' (Updated)' });
  },

  async delete(id: string): Promise<void> {
    console.log('Mock delete event:', id);
    return Promise.resolve();
  },

  async register(eventId: string): Promise<Event> {
    console.log('Mock register event:', eventId);
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return Promise.resolve({ ...event, registeredCount: event.registeredCount + 1 });
  },

  async unregister(eventId: string): Promise<Event> {
    console.log('Mock unregister event:', eventId);
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return Promise.resolve({ ...event, registeredCount: Math.max(0, event.registeredCount - 1) });
  },
};
