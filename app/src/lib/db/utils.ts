import { db } from './connection.js';
import * as schema from './schema.js';
import { eq, and, gt } from 'drizzle-orm';
import type { User, Session, NewUser, NewSession } from './schema.js';

// User utilities
export class UserService {
	static async findByEmail(email: string): Promise<User | null> {
		const result = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, email))
			.limit(1);
		
		return result[0] || null;
	}

	static async findByUsername(username: string): Promise<User | null> {
		const result = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.username, username))
			.limit(1);
		
		return result[0] || null;
	}

	static async findById(id: string): Promise<User | null> {
		const result = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, id))
			.limit(1);
		
		return result[0] || null;
	}

	static async create(userData: NewUser): Promise<User> {
		const result = await db
			.insert(schema.users)
			.values({
				...userData,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();
		
		return result[0];
	}

	static async updateLastLogin(userId: string): Promise<void> {
		await db
			.update(schema.users)
			.set({ 
				lastLoginAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(schema.users.id, userId));
	}

	static async verifyEmail(userId: string): Promise<void> {
		await db
			.update(schema.users)
			.set({ 
				emailVerified: true,
				updatedAt: new Date()
			})
			.where(eq(schema.users.id, userId));
	}
}

// Session utilities
export class SessionService {
	static async create(sessionData: NewSession): Promise<Session> {
		const result = await db
			.insert(schema.sessions)
			.values({
				...sessionData,
				createdAt: new Date(),
				lastUsedAt: new Date()
			})
			.returning();
		
		return result[0];
	}

	static async findById(sessionId: string): Promise<Session | null> {
		const result = await db
			.select()
			.from(schema.sessions)
			.where(eq(schema.sessions.id, sessionId))
			.limit(1);
		
		return result[0] || null;
	}

	static async findByUserId(userId: string): Promise<Session[]> {
		return await db
			.select()
			.from(schema.sessions)
			.where(eq(schema.sessions.userId, userId));
	}

	static async updateLastUsed(sessionId: string): Promise<void> {
		await db
			.update(schema.sessions)
			.set({ 
				lastUsedAt: new Date(),
				fresh: false
			})
			.where(eq(schema.sessions.id, sessionId));
	}

	static async delete(sessionId: string): Promise<void> {
		await db
			.delete(schema.sessions)
			.where(eq(schema.sessions.id, sessionId));
	}

	static async deleteByUserId(userId: string): Promise<void> {
		await db
			.delete(schema.sessions)
			.where(eq(schema.sessions.userId, userId));
	}

	static async deleteExpired(): Promise<void> {
		await db
			.delete(schema.sessions)
			.where(gt(schema.sessions.expiresAt, new Date()));
	}

	static async getUserWithSession(sessionId: string): Promise<{ user: User; session: Session } | null> {
		const result = await db
			.select({
				user: schema.users,
				session: schema.sessions
			})
			.from(schema.sessions)
			.innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
			.where(eq(schema.sessions.id, sessionId))
			.limit(1);

		return result[0] || null;
	}
}

// Token utilities
export class TokenService {
	static async createEmailVerificationToken(userId: string, token: string, expiresAt: Date) {
		const result = await db
			.insert(schema.emailVerificationTokens)
			.values({
				id: crypto.randomUUID(),
				userId,
				token,
				expiresAt,
				createdAt: new Date()
			})
			.returning();
		
		return result[0];
	}

	static async findEmailVerificationToken(token: string) {
		const result = await db
			.select()
			.from(schema.emailVerificationTokens)
			.where(eq(schema.emailVerificationTokens.token, token))
			.limit(1);
		
		return result[0] || null;
	}

	static async deleteEmailVerificationToken(token: string) {
		await db
			.delete(schema.emailVerificationTokens)
			.where(eq(schema.emailVerificationTokens.token, token));
	}

	static async createPasswordResetToken(userId: string, token: string, expiresAt: Date) {
		const result = await db
			.insert(schema.passwordResetTokens)
			.values({
				id: crypto.randomUUID(),
				userId,
				token,
				expiresAt,
				createdAt: new Date()
			})
			.returning();
		
		return result[0];
	}

	static async findPasswordResetToken(token: string) {
		const result = await db
			.select()
			.from(schema.passwordResetTokens)
			.where(eq(schema.passwordResetTokens.token, token))
			.limit(1);
		
		return result[0] || null;
	}

	static async deletePasswordResetToken(token: string) {
		await db
			.delete(schema.passwordResetTokens)
			.where(eq(schema.passwordResetTokens.token, token));
	}

	static async cleanupExpiredTokens() {
		const now = new Date();
		
		await db
			.delete(schema.emailVerificationTokens)
			.where(gt(schema.emailVerificationTokens.expiresAt, now));
		
		await db
			.delete(schema.passwordResetTokens)
			.where(gt(schema.passwordResetTokens.expiresAt, now));
	}
}

// Database health check
import { sql } from 'drizzle-orm';

export async function checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
	try {
		await db.select({ count: sql<number>`1` }).from(schema.users).limit(1);
		return { healthy: true };
	} catch (error) {
		return { 
			healthy: false, 
			error: error instanceof Error ? error.message : 'Unknown database error'
		};
	}
}