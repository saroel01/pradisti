import { initializeDB, migrateDB } from './connection.js';
import { dev } from '$app/environment';

let initialized = false;

/**
 * Initialize the database connection and run migrations
 * This should be called once during app startup
 */
export async function initDatabase() {
	if (initialized) {
		console.log('Database already initialized');
		return;
	}

	try {
		console.log('Initializing database...');
		
		// Initialize database connection
		initializeDB();
		
		// Run migrations in development mode
		if (dev) {
			await migrateDB();
		}
		
		initialized = true;
		console.log('Database initialized successfully');
		
	} catch (error) {
		console.error('Failed to initialize database:', error);
		throw error;
	}
}

/**
 * Check if database has been initialized
 */
export function isDatabaseInitialized(): boolean {
	return initialized;
}