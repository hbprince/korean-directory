/**
 * Environment variable validation
 * This runs on server-side only to validate required env vars at RUNTIME (not build time)
 */

export function validateEnv() {
  if (typeof window !== 'undefined') {
    // Client-side - skip validation
    return;
  }

  // Skip validation during build time (next build)
  // Build time: NEXT_PHASE is set to 'phase-production-build'
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  const requiredVars = ['DATABASE_URL'];

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[env] Missing required environment variables: ${missing.join(', ')}.\n` +
      `Set them in Vercel env vars (for production) and .env.local (for local development).`
    );
    // Don't throw during SSR/ISR - just log the error
    // The actual DB connection will fail with a clearer error
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

// Auto-validate on import (server-side only, runtime only)
if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
  validateEnv();
}
