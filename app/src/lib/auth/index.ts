/**
 * Main authentication module
 * Exports all authentication utilities and types
 */

// Configuration
export { 
  initializeLucia, 
  getLucia, 
  isLuciaReady,
  lucia 
} from './config.js';

// Initialization
export {
  initializeAuth,
  isAuthReady,
  shutdownAuth
} from './init.js';

// Password utilities
export {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateSecurePassword
} from './password.js';

// Session management
export {
  createSession,
  validateSessionFromCookies,
  setSessionCookie,
  clearSessionCookie,
  invalidateSession,
  invalidateAllUserSessions
} from './session.js';

// Core auth utilities
export {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  setDatabaseOperations
} from './utils.js';

// Hooks and guards
export {
  AuthGuard,
  getCurrentUser,
  getCurrentSession
} from './hooks.js';

// Middleware
export {
  withAuth,
  withGuest,
  withAuthAPI,
  AuthResponses
} from './middleware.js';

// Types
export type {
  User,
  Session,
  RegisterData,
  LoginData,
  AuthResult,
  SessionValidationResult,
  DatabaseUserAttributes,
  Lucia
} from '$lib/types/auth';