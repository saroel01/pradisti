/**
 * Authentication middleware utilities
 * These utilities help protect routes and handle auth redirects
 */

import { redirect } from '@sveltejs/kit';
import type { ServerLoad, RequestEvent } from '@sveltejs/kit';
import { AuthGuard, getCurrentUser, getCurrentSession } from './hooks.js';

/**
 * Higher-order function to create protected load functions
 * Requires authentication to access the route
 */
export function withAuth(
  loadFn?: (event: any) => Promise<any> | any
): ServerLoad {
  return async (event) => {
    const user = getCurrentUser(event.locals);
    const session = getCurrentSession(event.locals);

    if (!user || !session) {
      const redirectUrl = `/auth/login?redirect=${encodeURIComponent(event.url.pathname)}`;
      throw redirect(302, redirectUrl);
    }

    if (loadFn) {
      return await loadFn({ ...event, locals: { ...event.locals, user, session } });
    }

    return {};
  };
}

/**
 * Higher-order function to create guest-only load functions
 * Redirects authenticated users away from auth pages
 */
export function withGuest(
  loadFn?: (event: any) => Promise<any> | any,
  redirectTo: string = '/dashboard'
): ServerLoad {
  return async (event) => {
    const user = getCurrentUser(event.locals);
    
    if (user) {
      throw redirect(302, redirectTo);
    }

    if (loadFn) {
      return await loadFn(event);
    }

    return {};
  };
}

/**
 * Create a protected API endpoint
 */
export function withAuthAPI<T = any>(
  handler: (event: RequestEvent & { locals: { user: NonNullable<App.Locals['user']>, session: NonNullable<App.Locals['session']> } }) => Promise<Response> | Response
) {
  return async (event: RequestEvent) => {
    const user = getCurrentUser(event.locals);
    const session = getCurrentSession(event.locals);

    if (!user || !session) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }), 
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return await handler({ ...event, locals: { ...event.locals, user, session } });
  };
}

/**
 * Role-based access control middleware (placeholder for future implementation)
 */
export function withRole(
  requiredRole: string,
  loadFn?: ServerLoad
): ServerLoad {
  return withAuth(async (event) => {
    // This will be implemented when role system is added
    // For now, just ensure user is authenticated
    // In the future, check user.roles or permissions
    
    if (loadFn) {
      return await loadFn(event);
    }
    
    return {};
  });
}

/**
 * Permission-based access control middleware (placeholder for future implementation)
 */
export function withPermission(
  requiredPermission: string,
  loadFn?: ServerLoad
): ServerLoad {
  return withAuth(async (event) => {
    // This will be implemented when permission system is added
    // For now, just ensure user is authenticated
    // In the future, check user.permissions
    
    if (loadFn) {
      return await loadFn(event);
    }
    
    return {};
  });
}

/**
 * Session validation middleware for API endpoints
 */
export function validateSession(event: RequestEvent): {
  isValid: boolean;
  user: App.Locals['user'];
  session: App.Locals['session'];
} {
  const user = getCurrentUser(event.locals);
  const session = getCurrentSession(event.locals);
  
  return {
    isValid: !!(user && session),
    user,
    session
  };
}

/**
 * Create standardized auth error responses
 */
export const AuthResponses = {
  unauthorized: () => new Response(
    JSON.stringify({ 
      error: 'Unauthorized', 
      message: 'Authentication required' 
    }), 
    { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' } 
    }
  ),

  forbidden: (message: string = 'Access denied') => new Response(
    JSON.stringify({ 
      error: 'Forbidden', 
      message 
    }), 
    { 
      status: 403, 
      headers: { 'Content-Type': 'application/json' } 
    }
  ),

  sessionExpired: () => new Response(
    JSON.stringify({ 
      error: 'Session Expired', 
      message: 'Please log in again' 
    }), 
    { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' } 
    }
  )
};