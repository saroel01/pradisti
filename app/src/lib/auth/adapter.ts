/**
 * Lucia v3 adapter for Drizzle ORM with SQLite
 * This bridges Lucia with our database implementation
 */

import type { Adapter, DatabaseSession, DatabaseUser, RegisteredLucia } from 'lucia';
import { db } from '$lib/db/connection.js';
import { UserService, SessionService } from '$lib/db/utils.js';
import * as schema from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Custom Lucia adapter for Drizzle ORM with SQLite
 */
export class DrizzleSQLiteAdapter implements Adapter {
  async deleteSession(sessionId: string): Promise<void> {
    await SessionService.delete(sessionId);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await SessionService.deleteByUserId(userId);
  }

  async getSessionAndUser(sessionId: string): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    try {
      const result = await SessionService.getUserWithSession(sessionId);
      
      if (!result) {
        return [null, null];
      }

      const { session, user } = result;
      
      // Convert database session to Lucia session format
      const luciaSession: DatabaseSession = {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        attributes: {
          fresh: session.fresh,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          createdAt: session.createdAt,
          lastUsedAt: session.lastUsedAt
        }
      };

      // Convert database user to Lucia user format
      const luciaUser: DatabaseUser = {
        id: user.id,
        attributes: {
          username: user.username,
          email: user.email,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          display_name: user.displayName,
          avatar_url: user.avatarUrl,
          email_verified: user.emailVerified,
          last_login_at: user.lastLoginAt
        }
      };

      return [luciaSession, luciaUser];
    } catch (error) {
      console.error('Error in getSessionAndUser:', error);
      return [null, null];
    }
  }

  async getUserSessions(userId: string): Promise<DatabaseSession[]> {
    try {
      const sessions = await SessionService.findByUserId(userId);
      
      return sessions.map(session => ({
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        attributes: {
          fresh: session.fresh,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          createdAt: session.createdAt,
          lastUsedAt: session.lastUsedAt
        }
      }));
    } catch (error) {
      console.error('Error in getUserSessions:', error);
      return [];
    }
  }

  async setSession(session: DatabaseSession): Promise<void> {
    try {
      const attributes = session.attributes as any;
      await db.insert(schema.sessions).values({
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        fresh: attributes?.fresh ?? true,
        ipAddress: attributes?.ipAddress ?? null,
        userAgent: attributes?.userAgent ?? null,
        createdAt: attributes?.createdAt ?? new Date(),
        lastUsedAt: attributes?.lastUsedAt ?? new Date()
      });
    } catch (error) {
      console.error('Error in setSession:', error);
      throw error;
    }
  }

  async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
    try {
      await db
        .update(schema.sessions)
        .set({ 
          expiresAt,
          lastUsedAt: new Date(),
          fresh: false
        })
        .where(eq(schema.sessions.id, sessionId));
    } catch (error) {
      console.error('Error in updateSessionExpiration:', error);
      throw error;
    }
  }

  async deleteExpiredSessions(): Promise<void> {
    await SessionService.deleteExpired();
  }
}

/**
 * Create and export the adapter instance
 */
export const drizzleAdapter = new DrizzleSQLiteAdapter();