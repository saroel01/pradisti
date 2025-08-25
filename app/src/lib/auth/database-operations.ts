/**
 * Database operations for authentication
 * This bridges the auth system with the database layer
 */

import { UserService } from '$lib/db/utils.js';
import type { User, NewUser } from '$lib/db/schema.js';
import type { User as AuthUser } from '$lib/types/auth';

/**
 * Database operations implementation for auth system
 */
export const authDatabaseOperations = {
  async createUser(data: { email: string; username: string; hashedPassword: string }): Promise<AuthUser> {
    const newUser: NewUser = {
      id: crypto.randomUUID(),
      email: data.email,
      username: data.username,
      passwordHash: data.hashedPassword,
      displayName: null,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      lastLoginAt: null
    };

    const dbUser = await UserService.create(newUser);
    
    // Convert database user to auth user format
    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    };
  },

  async getUserByEmail(email: string): Promise<(AuthUser & { hashedPassword: string }) | null> {
    const dbUser = await UserService.findByEmail(email);
    
    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
      hashedPassword: dbUser.passwordHash
    };
  },

  async getUserById(id: string): Promise<AuthUser | null> {
    const dbUser = await UserService.findById(id);
    
    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    };
  },

  async updateUser(id: string, data: Partial<AuthUser>): Promise<AuthUser> {
    // This is a simplified update - in a full implementation,
    // you'd need to implement UserService.update method
    const user = await UserService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // For now, just return the existing user since we don't have update implemented
    // TODO: Implement update functionality in UserService
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  },

  async deleteUser(id: string): Promise<void> {
    // This is a placeholder - in a full implementation,
    // you'd need to implement UserService.delete method
    // TODO: Implement delete functionality in UserService
    throw new Error('User deletion not implemented yet');
  }
};