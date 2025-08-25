/**
 * Authentication system initialization
 * This sets up the auth system when the app starts
 */

import { initializeLucia } from './config.js';
import { initializeDB, migrateDB } from '$lib/db/connection.js';
import { checkDatabaseHealth } from '$lib/db/utils.js';

/**
 * Initialize the authentication system
 * This should be called when the app starts
 */
export async function initializeAuth(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('🔄 Initializing authentication system...');

    // 1. Initialize database
    console.log('🔄 Initializing database...');
    initializeDB();

    // 2. Run database migrations
    console.log('🔄 Running database migrations...');
    await migrateDB();

    // 3. Check database health
    console.log('🔄 Checking database health...');
    const healthCheck = await checkDatabaseHealth();
    if (!healthCheck.healthy) {
      throw new Error(`Database health check failed: ${healthCheck.error}`);
    }

    // 4. Initialize Lucia authentication
    console.log('🔄 Initializing Lucia authentication...');
    const lucia = initializeLucia();

    if (!lucia) {
      throw new Error('Failed to initialize Lucia');
    }

    console.log('✅ Authentication system initialized successfully');
    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to initialize authentication system:', errorMessage);
    return { 
      success: false, 
      error: errorMessage 
    };
  }
}

/**
 * Check if authentication system is ready
 */
export async function isAuthReady(): Promise<boolean> {
  try {
    const healthCheck = await checkDatabaseHealth();
    return healthCheck.healthy;
  } catch (error) {
    console.error('Auth readiness check failed:', error);
    return false;
  }
}

/**
 * Graceful shutdown of auth system
 */
export function shutdownAuth(): void {
  console.log('🔄 Shutting down authentication system...');
  // Add any cleanup logic here
  console.log('✅ Authentication system shutdown complete');
}