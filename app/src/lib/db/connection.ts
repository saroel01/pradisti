import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { dev } from '$app/environment';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { join } from 'path';

// Database file path
const dbPath = dev ? 'db/pradisti-dev.db' : 'db/pradisti.db';

// Create database connection
const sqlite = new Database(dbPath, {
	verbose: dev ? console.log : undefined
});

// Enable foreign key constraints
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('journal_mode = WAL');

// Create Drizzle database instance
export const db = drizzle(sqlite, { schema });

// Migration function
export async function migrateDB() {
	try {
		console.log('Running database migrations...');
		migrate(db, { migrationsFolder: './drizzle' });
		console.log('Database migrations completed successfully');
	} catch (error) {
		console.error('Migration failed:', error);
		throw error;
	}
}

// Database initialization
export function initializeDB() {
	// Ensure database directory exists
	try {
		const fs = require('fs');
		const path = require('path');
		const dbDir = path.dirname(dbPath);
		if (!fs.existsSync(dbDir)) {
			fs.mkdirSync(dbDir, { recursive: true });
		}
	} catch (error) {
		console.error('Failed to create database directory:', error);
	}

	return db;
}

// Export sqlite instance for advanced operations if needed
export { sqlite };

// Graceful shutdown
process.on('SIGINT', () => {
	sqlite.close();
	process.exit(0);
});

process.on('SIGTERM', () => {
	sqlite.close();
	process.exit(0);
});