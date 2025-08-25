// Export database connection and initialization
export { db, sqlite, migrateDB, initializeDB } from './connection.js';

// Export schema and types
export * from './schema.js';

// Export utility services
export { UserService, SessionService, TokenService, checkDatabaseHealth } from './utils.js';

// Re-export drizzle utilities that might be useful
export { eq, and, or, not, gt, gte, lt, lte, like, ilike, inArray } from 'drizzle-orm';