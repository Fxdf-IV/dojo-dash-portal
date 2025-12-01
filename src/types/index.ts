// Tipos compartilhados entre frontend e backend

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  beltId?: string;
  location?: string;
  status?: 'active' | 'pending' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  birthDate?: string;
  phone?: string;
  startDate?: string;
  beltId: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'kihon' | 'kata' | 'theory' | 'bunkai';
  description?: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
  minBeltId?: string; // Mudança: usar minBeltId em vez de minKyu
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationImage {
  imageUrl: string;
  caption?: string;
}

export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  mapUrl?: string;
  imageUrl?: string;
  images: LocationImage[];
  schedule?: ScheduleItem[];
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sensei {
  id: string;
  name: string;
  rank: string;
  description?: string;
  imageUrl?: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  imageUrl?: string;
  registrationPrice?: number;
  registeredStudents: string[];
  registeredCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// DTOs para requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  location: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}
