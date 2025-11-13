// Configuração base para chamadas API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new ApiError(response.status, error.error || error.message || 'Erro na requisição');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Erro de conexão com o servidor');
  }
}
