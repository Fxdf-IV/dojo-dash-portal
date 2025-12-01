// Export central de todos os services

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

import { senseisService as realSenseis } from './senseis';
import { senseisService as mockSenseis } from './mock/senseis';

import { locationsService as realLocations } from './locations';
import { locationsService as mockLocations } from './mock/locations';

import { eventsService as realEvents } from './events';
import { eventsService as mockEvents } from './mock/events';

import { authService as realAuth } from './auth';
import { authService as mockAuth } from './mock/auth';

export const senseisService = useMock ? mockSenseis : realSenseis;
export const locationsService = useMock ? mockLocations : realLocations;
export const eventsService = useMock ? mockEvents : realEvents;
export const authService = useMock ? mockAuth : realAuth;

export * from './users';
export * from './students';
export * from './materials';
export * from './contacts';
export * from './upload';
export * from './contactSettings';
export { apiRequest, ApiError, getAuthToken, setAuthToken, clearAuthToken } from './api';

