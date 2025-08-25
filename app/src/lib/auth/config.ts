/**
 * Lucia v3 Authentication Configuration
 */

import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { drizzleAdapter } from './adapter.js';
import type { DatabaseUserAttributes } from '$lib/types/auth';

// Lucia instance
export let lucia: Lucia<{}, DatabaseUserAttributes> | null = null;

/**
 * Initialize Lucia authentication
 */
export function initializeLucia() {
  try {
    lucia = new Lucia(drizzleAdapter, {
      sessionCookie: {
        name: 'pradisti-session',
        expires: false, // Session cookies (expire when browser closes)
        attributes: {
          secure: !dev, // Use secure cookies in production
          sameSite: 'strict'
        }
      },
      getUserAttributes: (attributes) => ({
        email: attributes.email,
        username: attributes.username,
        createdAt: attributes.created_at,
        updatedAt: attributes.updated_at,
        displayName: attributes.display_name,
        avatarUrl: attributes.avatar_url,
        emailVerified: attributes.email_verified,
        lastLoginAt: attributes.last_login_at
      })
    });
    
    console.log('✅ Lucia authentication initialized');
    return lucia;
  } catch (error) {
    console.error('❌ Failed to initialize Lucia:', error);
    throw error;
  }
}

/**
 * Get the Lucia instance (ensure it's initialized)
 */
export function getLucia(): Lucia<{}, DatabaseUserAttributes> {
  if (!lucia) {
    throw new Error('Lucia not initialized. Call initializeLucia() first.');
  }
  return lucia;
}

/**
 * Check if Lucia is ready (adapter configured)
 */
export function isLuciaReady(): boolean {
  return lucia !== null;
}