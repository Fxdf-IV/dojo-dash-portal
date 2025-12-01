import { apiRequest } from './api';
import type { User } from '@/types';

interface UsersResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

export const usersService = {
  async getAll(role?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest<UsersResponse>(`/users${query}`, {
      requireAuth: true,
    });

    return response.users;
  },

  async create(data: Partial<User> & { password?: string }): Promise<User> {
    // Prepare payload
    const payload = {
      ...data,
      role: 'admin',
      location: data.location || 'Sede', // Default location if missing
    };

    // No need to append dummy domain anymore
    // Backend handles email or username logic

    const response = await apiRequest<UserResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
      requireAuth: true,
    });

    return response.user;
  },

  async update(id: string, data: Partial<User> & { password?: string }): Promise<User> {
    const payload = { ...data };
    
    // No need to append dummy domain anymore

    const response = await apiRequest<UserResponse>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requireAuth: true,
    });

    return response.user;
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
