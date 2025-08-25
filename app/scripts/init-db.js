import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
	console.log('🚀 Initializing PRADISTI database...');
	
	try {
		// Create database directory if it doesn't exist
		const fs = await import('fs');
		const dbDir = './db';
		if (!fs.existsSync(dbDir)) {
			fs.mkdirSync(dbDir, { recursive: true });
			console.log('✅ Created database directory');
		}

		// Setup development database
		const dbPath = './db/pradisti-dev.db';
		const sqlite = new Database(dbPath);
		
		// Enable optimizations
		sqlite.pragma('foreign_keys = ON');
		sqlite.pragma('journal_mode = WAL');
		sqlite.pragma('synchronous = NORMAL');
		sqlite.pragma('temp_store = MEMORY');
		sqlite.pragma('mmap_size = 268435456'); // 256MB
		
		console.log('✅ Database connection established');

		// Create drizzle instance
		const db = drizzle(sqlite);

		// Run migrations
		console.log('🔄 Running database migrations...');
		migrate(db, { migrationsFolder: './drizzle' });
		console.log('✅ Database migrations completed');

		// Test connection
		const testQuery = sqlite.prepare('SELECT sqlite_version() as version').get();
		console.log('✅ Database test successful - SQLite version:', testQuery.version);

		sqlite.close();
		console.log('🎉 Database initialization completed!');
		
	} catch (error) {
		console.error('❌ Database initialization failed:', error);
		process.exit(1);
	}
}

// Run initialization
initDatabase();