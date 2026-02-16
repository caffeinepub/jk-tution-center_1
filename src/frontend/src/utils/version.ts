/**
 * Application version information for production deployment tracking
 */

// Version label for the current deployment
export const APP_VERSION = 'Version 9';

// Build timestamp (set by build process if available)
export const BUILD_TIMESTAMP = import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString();

// Commit hash (set by build process if available)
export const COMMIT_HASH = import.meta.env.VITE_COMMIT_HASH || 'unknown';

/**
 * Get formatted version string for display
 */
export function getVersionString(): string {
  return APP_VERSION;
}

/**
 * Get full version info including build metadata
 */
export function getFullVersionInfo() {
  return {
    version: APP_VERSION,
    buildTimestamp: BUILD_TIMESTAMP,
    commitHash: COMMIT_HASH,
  };
}
