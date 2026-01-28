/**
 * Environment variable validation
 * This runs on server-side only to validate required env vars
 */

export function validateEnv() {
  if (typeof window !== 'undefined') {
    // Client-side - skip validation
    return;
  }

  const requiredVars = ['DATABASE_URL'];

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
      `Set them in Vercel env vars (for production) and .env.local (for local development).`
    );
  }

  // Warn about deprecated vars
  const deprecatedVars = ['PRISMA_DATABASE_URL', 'POSTGRES_URL'];
  const foundDeprecated = deprecatedVars.filter((key) => process.env[key]);

  if (foundDeprecated.length > 0) {
    console.warn(
      `[env] Warning: Found deprecated env vars: ${foundDeprecated.join(', ')}.\n` +
      `These are no longer used. Please remove them and use DATABASE_URL only.`
    );
  }
}

// Auto-validate on import (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}
