/**
 * SvelteKit server hooks
 * Integrates authentication with the request/response cycle
 */

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { authHandle } from '$lib/auth/hooks';
import { initializeAuth } from '$lib/auth';

// Initialize auth system on startup
initializeAuth().then((result) => {
  if (result.success) {
    console.log('✅ Auth system ready');
  } else {
    console.error('❌ Auth system failed to initialize:', result.error);
  }
});

// Combine all handles in sequence
export const handle: Handle = sequence(
  // Authentication handle (must be first to set locals.user and locals.session)
  authHandle,
  
  // Add more handles here as needed
  // For example: CORS, rate limiting, logging, etc.
  async ({ event, resolve }) => {
    // Custom handle logic can go here
    return resolve(event);
  }
);

/**
 * Handle server errors
 */
export async function handleError({ error, event, status, message }): Promise<{ message: string }> {
  const errorId = crypto.randomUUID();
  
  // Log error details (in production, use proper logging service)
  console.error('Server error:', {
    errorId,
    error,
    url: event.url.href,
    method: event.request.method,
    status,
    message,
    userAgent: event.request.headers.get('user-agent'),
    userId: event.locals.user?.id || 'anonymous'
  });

  // Don't expose internal error details to the client
  return {
    message: status >= 500 ? 'Internal server error' : message
  };
}

/**
 * Transform fetch requests (optional)
 */
export async function handleFetch({ request, fetch, event }) {
  // Add authentication headers to internal API calls if needed
  if (request.url.startsWith(event.url.origin) && event.locals.session) {
    // Could add session ID to internal requests for tracking
    request.headers.set('X-Session-ID', event.locals.session.id);
  }
  
  return fetch(request);
}