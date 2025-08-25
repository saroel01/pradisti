/**
 * Core authentication utilities
 */

import type { RegisterData, LoginData, AuthResult, User } from '$lib/types/auth';
import { hashPassword, verifyPassword, validatePasswordStrength } from './password.js';
import { createSession, invalidateSession } from './session.js';
import { isLuciaReady } from './config.js';

// Placeholder for database operations - will be implemented once Stream 2 is ready
interface DatabaseOperations {
  createUser(data: { email: string; username: string; hashedPassword: string }): Promise<User>;
  getUserByEmail(email: string): Promise<(User & { hashedPassword: string }) | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

import { authDatabaseOperations } from './database-operations.js';

// Initialize with database operations
let dbOperations: DatabaseOperations | null = authDatabaseOperations;

/**
 * Set database operations (called when Stream 2 is ready)
 */
export function setDatabaseOperations(operations: DatabaseOperations): void {
  dbOperations = operations;
  console.log('✅ Database operations configured for auth system');
}

/**
 * Check if database operations are ready
 */
function isDatabaseReady(): boolean {
  return dbOperations !== null;
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    // Check if systems are ready
    if (!isLuciaReady() || !isDatabaseReady()) {
      return {
        success: false,
        error: 'Authentication system not ready. Waiting for database setup.'
      };
    }

    // Validate input
    const validation = validateRegistrationData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Check if user already exists
    const existingUser = await dbOperations!.getUserByEmail(data.email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await dbOperations!.createUser({
      email: data.email.toLowerCase(),
      username: data.username,
      hashedPassword
    });

    // Create session
    const session = await createSession(user.id);

    return {
      success: true,
      user,
      session
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Failed to register user'
    };
  }
}

/**
 * Log in a user
 */
export async function loginUser(data: LoginData): Promise<AuthResult> {
  try {
    // Check if systems are ready
    if (!isLuciaReady() || !isDatabaseReady()) {
      return {
        success: false,
        error: 'Authentication system not ready. Waiting for database setup.'
      };
    }

    // Validate input
    if (!data.email || !data.password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    // Find user
    const userWithPassword = await dbOperations!.getUserByEmail(data.email.toLowerCase());
    if (!userWithPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, userWithPassword.hashedPassword);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Create session
    const session = await createSession(userWithPassword.id);

    // Return user without password hash
    const { hashedPassword, ...user } = userWithPassword;

    return {
      success: true,
      user,
      session
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Failed to log in'
    };
  }
}

/**
 * Log out a user
 */
export async function logoutUser(sessionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isLuciaReady()) {
      return {
        success: false,
        error: 'Authentication system not ready'
      };
    }

    await invalidateSession(sessionId);

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Failed to log out'
    };
  }
}

/**
 * Validate registration data
 */
function validateRegistrationData(data: RegisterData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Email validation
  if (!data.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Username validation
  if (!data.username) {
    errors.push('Username is required');
  } else if (data.username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (data.username.length > 50) {
    errors.push('Username must be no more than 50 characters long');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.push('Username can only contain letters, numbers, underscores, and dashes');
  }

  // Password validation
  if (!data.password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    if (!isDatabaseReady()) {
      return null;
    }

    return await dbOperations!.getUserById(id);
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}