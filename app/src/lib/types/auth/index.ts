/**
 * Authentication types for Lucia v3 integration
 */

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

export interface SessionValidationResult {
  session: Session | null;
  user: User | null;
}

import type { Lucia } from 'lucia';

// Lucia types augmentation
declare module 'lucia' {
  interface Register {
    Lucia: Lucia<{}, DatabaseUserAttributes>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export interface DatabaseUserAttributes {
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  display_name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  last_login_at: Date | null;
}

// Re-export Lucia types for convenience
export type { Lucia } from 'lucia';