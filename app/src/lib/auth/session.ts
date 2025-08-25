/**
 * Session management utilities
 */

import { getLucia, isLuciaReady } from './config.js';
import type { SessionValidationResult, User, Session } from '$lib/types/auth';
import type { Cookies } from '@sveltejs/kit';

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<Session> {
  if (!isLuciaReady()) {
    throw new Error('Lucia not initialized. Waiting for database setup.');
  }

  const lucia = getLucia();
  const session = await lucia.createSession(userId, {});
  
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    createdAt: new Date()
  };
}

/**
 * Validate a session from cookies
 */
export async function validateSessionFromCookies(cookies: Cookies): Promise<SessionValidationResult> {
  if (!isLuciaReady()) {
    return { session: null, user: null };
  }

  const lucia = getLucia();
  const sessionId = cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    return { session: null, user: null };
  }

  try {
    const result = await lucia.validateSession(sessionId);
    
    if (result.session && result.session.fresh) {
      // Refresh session cookie if needed
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: sessionCookie.attributes.path || '/',
        maxAge: sessionCookie.attributes.maxAge,
        sameSite: sessionCookie.attributes.sameSite as any,
        secure: sessionCookie.attributes.secure,
        httpOnly: true
      });
    }

    if (!result.session) {
      // Invalid session - clear cookie
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: sessionCookie.attributes.path || '/',
        maxAge: sessionCookie.attributes.maxAge,
        sameSite: sessionCookie.attributes.sameSite as any,
        secure: sessionCookie.attributes.secure,
        httpOnly: true
      });
    }

    return {
      session: result.session ? {
        id: result.session.id,
        userId: result.session.userId,
        expiresAt: result.session.expiresAt,
        createdAt: new Date()
      } : null,
      user: result.user ? {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        createdAt: result.user.created_at,
        updatedAt: result.user.updated_at
      } : null
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return { session: null, user: null };
  }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(cookies: Cookies, sessionId: string): Promise<void> {
  if (!isLuciaReady()) {
    throw new Error('Lucia not initialized. Waiting for database setup.');
  }

  const lucia = getLucia();
  const sessionCookie = lucia.createSessionCookie(sessionId);
  
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: sessionCookie.attributes.path || '/',
    maxAge: sessionCookie.attributes.maxAge,
    sameSite: sessionCookie.attributes.sameSite as any,
    secure: sessionCookie.attributes.secure,
    httpOnly: true
  });
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(cookies: Cookies): Promise<void> {
  if (!isLuciaReady()) {
    return; // Nothing to clear if not initialized
  }

  const lucia = getLucia();
  const sessionCookie = lucia.createBlankSessionCookie();
  
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: sessionCookie.attributes.path || '/',
    maxAge: sessionCookie.attributes.maxAge,
    sameSite: sessionCookie.attributes.sameSite as any,
    secure: sessionCookie.attributes.secure,
    httpOnly: true
  });
}

/**
 * Invalidate a session
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  if (!isLuciaReady()) {
    throw new Error('Lucia not initialized. Waiting for database setup.');
  }

  const lucia = getLucia();
  await lucia.invalidateSession(sessionId);
}

/**
 * Invalidate all sessions for a user
 */
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  if (!isLuciaReady()) {
    throw new Error('Lucia not initialized. Waiting for database setup.');
  }

  const lucia = getLucia();
  await lucia.invalidateUserSessions(userId);
}