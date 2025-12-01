import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';
import { setAuthToken, clearAuthToken } from '@/services/api';

const MOCK_ADMIN: User = {
  id: 'mock-admin-id',
  name: 'Administrador Mock',
  email: 'admin@test.com',
  role: 'admin',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_STUDENT: User = {
  id: 'mock-student-id',
  name: 'Aluno Mock',
  email: 'student@test.com',
  role: 'student',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (credentials.password !== '1234') {
      throw new Error('Credenciais inválidas.');
    }

    if (credentials.email === 'admin@test.com') {
      const token = 'mock-admin-token';
      setAuthToken(token);
      return {
        token,
        user: MOCK_ADMIN
      };
    }

    if (credentials.email === 'student@test.com') {
      const token = 'mock-student-token';
      setAuthToken(token);
      return {
        token,
        user: MOCK_STUDENT
      };
    }

    throw new Error('Credenciais inválidas. Use admin@test.com ou student@test.com');
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = 'mock-new-user-token';
    setAuthToken(token);
    
    const newUser: User = {
      id: `mock-user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student', // Default to student
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      token,
      user: newUser
    };
  },

  async logout(): Promise<void> {
    clearAuthToken();
  },

  async refreshUser(): Promise<{ user: User }> {
    // In a real app this would check the token. 
    // For mock, we can check if there is a token in localStorage (handled by api.ts but we can't access it easily here without duplicating logic).
    // However, since we are mocking the service, we can just return the admin or student based on some stored state if we wanted to be complex.
    // But `refreshUser` is usually called on app load. 
    // If we want to persist the "login" across reloads in mock mode, we need to know WHO is logged in.
    // Since `api.ts` stores the token in localStorage, we can check that? 
    // Actually, `setAuthToken` sets it in localStorage.
    
    // A simple way is to decode the mock token if we made it meaningful, or just return a default user if a token exists.
    // Let's assume if token is 'mock-admin-token' it's admin, else student.
    
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    if (token === 'mock-admin-token') {
      return { user: MOCK_ADMIN };
    }
    
    return { user: MOCK_STUDENT };
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Email de recuperação enviado (Mock)' };
  },
};
