import { apiRequest } from './api';
import { uploadService } from './upload';
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

  async create(data: Partial<Event> | FormData): Promise<Event> {
    if (data instanceof FormData) {
      // Extrair dados do FormData
      const eventData: Partial<Event> = {
        title: data.get('title') as string,
        description: data.get('description') as string || undefined,
        date: data.get('date') as string,
        registrationPrice: parseFloat(data.get('registrationPrice') as string) || undefined,
      };

      // Upload de imagem se existir
      const imageFile = data.get('image') as File;
      if (imageFile) {
        eventData.imageUrl = await uploadService.uploadImage(imageFile);
      }

      return this.create(eventData);
    }

    const response = await apiRequest<EventResponse>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.event;
  },

  async update(id: string, data: Partial<Event> | FormData): Promise<Event> {
    if (data instanceof FormData) {
      // Primeiro, buscar o evento atual para verificar imagens existentes
      const currentEvent = await this.getById(id);

      // Extrair dados do FormData
      const eventData: Partial<Event> = {
        title: data.get('title') as string,
        description: data.get('description') as string || undefined,
        date: data.get('date') as string,
        registrationPrice: parseFloat(data.get('registrationPrice') as string) || undefined,
      };

      // Upload de nova imagem se existir
      const imageFile = data.get('image') as File;
      if (imageFile) {
        // Remover imagem antiga se existir
        if (currentEvent.imageUrl) {
          try {
            await uploadService.deleteImage(currentEvent.imageUrl);
          } catch (error) {
            console.warn('Erro ao remover imagem anterior:', error);
          }
        }
        eventData.imageUrl = await uploadService.uploadImage(imageFile);
      } else {
        // Manter imagem existente se não houver nova
        eventData.imageUrl = currentEvent.imageUrl;
      }

      return this.update(id, eventData);
    }

    const response = await apiRequest<EventResponse>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.event;
  },

  async delete(id: string): Promise<void> {
    // Buscar evento para remover imagens associadas
    try {
      const event = await this.getById(id);

      // Remover imagem se existir
      if (event.imageUrl) {
        try {
          await uploadService.deleteImage(event.imageUrl);
        } catch (error) {
          console.warn('Erro ao remover imagem do evento:', error);
        }
      }
    } catch (error) {
      console.warn('Erro ao buscar evento para remoção de imagens:', error);
    }

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
