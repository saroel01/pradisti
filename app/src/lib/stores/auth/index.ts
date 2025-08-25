/**
 * Authentication store for client-side state management
 */

import { writable, derived } from 'svelte/store';
import type { User, Session } from '$lib/types/auth';

// Auth state interface
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false
};

// Create the main auth store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialAuthState);

  return {
    subscribe,
    
    // Initialize auth state (called on app start)
    init: (user: User | null, session: Session | null) => {
      update(state => ({
        ...state,
        user,
        session,
        isLoading: false,
        isInitialized: true
      }));
    },

    // Set user and session (after login)
    setAuth: (user: User, session: Session) => {
      update(state => ({
        ...state,
        user,
        session,
        isLoading: false,
        isInitialized: true
      }));
    },

    // Clear auth state (after logout)
    clearAuth: () => {
      update(state => ({
        ...state,
        user: null,
        session: null,
        isLoading: false,
        isInitialized: true
      }));
    },

    // Set loading state
    setLoading: (isLoading: boolean) => {
      update(state => ({
        ...state,
        isLoading
      }));
    },

    // Update user info
    updateUser: (user: User) => {
      update(state => ({
        ...state,
        user
      }));
    },

    // Reset to initial state
    reset: () => {
      set(initialAuthState);
    }
  };
}

// Create the auth store instance
export const authStore = createAuthStore();

// Derived stores for convenience
export const user = derived(authStore, $auth => $auth.user);
export const session = derived(authStore, $auth => $auth.session);
export const isAuthenticated = derived(authStore, $auth => !!($auth.user && $auth.session));
export const isLoading = derived(authStore, $auth => $auth.isLoading);
export const isInitialized = derived(authStore, $auth => $auth.isInitialized);

// Auth utilities for components
export const authUtils = {
  /**
   * Check if user has specific role/permission (placeholder for future)
   */
  hasRole: (role: string): boolean => {
    // This will be implemented when role system is added
    return false;
  },

  /**
   * Get user display name
   */
  getDisplayName: (user: User | null): string => {
    if (!user) return '';
    return user.username || user.email || 'User';
  },

  /**
   * Check if session is expired
   */
  isSessionExpired: (session: Session | null): boolean => {
    if (!session) return true;
    return new Date() > new Date(session.expiresAt);
  },

  /**
   * Get time until session expires
   */
  getSessionTimeLeft: (session: Session | null): number => {
    if (!session) return 0;
    const now = new Date().getTime();
    const expires = new Date(session.expiresAt).getTime();
    return Math.max(0, expires - now);
  },

  /**
   * Format session expiry time
   */
  formatSessionExpiry: (session: Session | null): string => {
    if (!session) return 'No session';
    const timeLeft = authUtils.getSessionTimeLeft(session);
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  }
};