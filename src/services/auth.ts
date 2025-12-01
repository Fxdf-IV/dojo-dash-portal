import { apiRequest, setAuthToken, clearAuthToken } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        requireAuth: true,
      });
    } finally {
      clearAuthToken();
    }
  },

  async refreshUser(): Promise<{ user: any }> {
    return await apiRequest<{ user: any }>('/auth/me', {
      method: 'GET',
      requireAuth: true,
    });
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    return await apiRequest<{ success: boolean; message?: string }>('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
