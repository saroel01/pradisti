/**
 * SvelteKit authentication hooks
 * These hooks integrate with SvelteKit's request/response cycle
 */

import type { Handle } from '@sveltejs/kit';
import { validateSessionFromCookies, isLuciaReady } from './index.js';

/**
 * Authentication handle hook
 * This runs on every request to validate the user's session
 */
export const authHandle: Handle = async ({ event, resolve }) => {
  // Skip auth validation if system not ready
  if (!isLuciaReady()) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  try {
    // Validate session from cookies
    const { session, user } = await validateSessionFromCookies(event.cookies);
    
    // Set locals for use in load functions and routes
    event.locals.user = user;
    event.locals.session = session;

    // Add user info to the response headers for client-side access (optional)
    const response = await resolve(event);
    
    if (user) {
      response.headers.set('X-User-ID', user.id);
    }

    return response;
  } catch (error) {
    console.error('Auth hook error:', error);
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }
};

/**
 * Route guard utilities
 */
export class AuthGuard {
  /**
   * Check if user is authenticated
   */
  static isAuthenticated(locals: App.Locals): boolean {
    return !!(locals.user && locals.session);
  }

  /**
   * Require authentication (throw redirect if not authenticated)
   */
  static requireAuth(locals: App.Locals, redirectTo: string = '/auth/login'): void {
    if (!this.isAuthenticated(locals)) {
      throw new Error(`Redirect:${redirectTo}`);
    }
  }

  /**
   * Require no authentication (redirect if authenticated)
   */
  static requireGuest(locals: App.Locals, redirectTo: string = '/dashboard'): void {
    if (this.isAuthenticated(locals)) {
      throw new Error(`Redirect:${redirectTo}`);
    }
  }
}

/**
 * Helper to get current user from locals
 */
export function getCurrentUser(locals: App.Locals) {
  return locals.user;
}

/**
 * Helper to get current session from locals
 */
export function getCurrentSession(locals: App.Locals) {
  return locals.session;
}