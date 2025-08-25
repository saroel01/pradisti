import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { hash } from 'bcrypt';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define schema for seeding
const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	displayName: text('display_name'),
	avatarUrl: text('avatar_url'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	lastLoginAt: integer('last_login_at', { mode: 'timestamp' })
});

const userProfiles = sqliteTable('user_profiles', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	firstName: text('first_name'),
	lastName: text('last_name'),
	bio: text('bio'),
	location: text('location'),
	website: text('website'),
	birthDate: integer('birth_date', { mode: 'timestamp' }),
	phoneNumber: text('phone_number'),
	preferences: text('preferences', { mode: 'json' }),
	metadata: text('metadata', { mode: 'json' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Database setup
const dbPath = './db/pradisti-dev.db';
const sqlite = new Database(dbPath);
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite, { schema: { users, userProfiles } });

async function seed() {
	console.log('🌱 Starting database seeding...');

	try {
		// Create test user
		const testUserPassword = await hash('password123', 12);
		const testUserId = 'test-user-' + Date.now();
		
		const testUser = await db.insert(users).values({
			id: testUserId,
			username: 'testuser',
			email: 'test@pradisti.app',
			passwordHash: testUserPassword,
			displayName: 'Test User',
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true
		}).returning();

		console.log('✅ Created test user:', testUser[0].username);

		// Create user profile
		await db.insert(userProfiles).values({
			id: crypto.randomUUID(),
			userId: testUserId,
			firstName: 'Test',
			lastName: 'User',
			bio: 'This is a test user account for development purposes.',
			location: 'Test Location',
			preferences: JSON.stringify({
				theme: 'light',
				notifications: true
			}),
			metadata: JSON.stringify({
				source: 'seed_script'
			}),
			createdAt: new Date(),
			updatedAt: new Date()
		});

		console.log('✅ Created user profile for test user');

		// Create admin user
		const adminUserPassword = await hash('admin123', 12);
		const adminUserId = 'admin-user-' + Date.now();
		
		const adminUser = await db.insert(users).values({
			id: adminUserId,
			username: 'admin',
			email: 'admin@pradisti.app',
			passwordHash: adminUserPassword,
			displayName: 'Administrator',
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true
		}).returning();

		console.log('✅ Created admin user:', adminUser[0].username);

		// Create admin profile
		await db.insert(userProfiles).values({
			id: crypto.randomUUID(),
			userId: adminUserId,
			firstName: 'Admin',
			lastName: 'User',
			bio: 'System administrator account.',
			preferences: JSON.stringify({
				theme: 'dark',
				notifications: true,
				adminPanel: true
			}),
			metadata: JSON.stringify({
				source: 'seed_script',
				role: 'admin'
			}),
			createdAt: new Date(),
			updatedAt: new Date()
		});

		console.log('✅ Created admin profile');

		console.log('🎉 Database seeding completed successfully!');
		console.log('');
		console.log('Test accounts created:');
		console.log('  Test User: testuser / password123');
		console.log('  Admin User: admin / admin123');
		console.log('');

	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	} finally {
		sqlite.close();
	}
}

// Run seeding
seed().catch((error) => {
	console.error('Fatal error during seeding:', error);
	process.exit(1);
});