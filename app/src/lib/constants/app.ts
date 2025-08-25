// Application constants
export const APP_NAME = 'PRADISTI';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Modern Web Application built with SvelteKit';

// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.pradisti.com' 
  : 'http://localhost:5173/api';

// Theme Configuration  
export const DEFAULT_THEME = 'light';
export const AVAILABLE_THEMES = [
  'light',
  'dark', 
  'corporate',
  'business',
  'emerald',
  'forest',
  'luxury',
  'night'
] as const;

// Route Configuration
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'pradisti-theme',
  USER: 'pradisti-user',
  AUTH_TOKEN: 'pradisti-auth-token',
  PREFERENCES: 'pradisti-preferences'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
} as const;