/**
 * Authentication utilities for the utils layer
 * These are convenience functions for common auth operations
 */

// Re-export main auth functionality for convenience
export {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  validatePasswordStrength,
  generateSecurePassword,
  AuthGuard,
  getCurrentUser,
  getCurrentSession,
  withAuth,
  withGuest,
  withAuthAPI,
  AuthResponses
} from '$lib/auth';

// Re-export auth types
export type {
  User,
  Session,
  RegisterData,
  LoginData,
  AuthResult,
  SessionValidationResult
} from '$lib/types/auth';

// Re-export stores
export {
  authStore,
  user,
  session,
  isAuthenticated,
  isLoading,
  isInitialized,
  authUtils
} from '$lib/stores/auth';