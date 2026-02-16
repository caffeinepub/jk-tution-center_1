/**
 * Internet Computer environment utilities for production deployment
 */

/**
 * Get the application base URL
 * In production on IC, this will be the canister URL
 */
export function getBaseUrl(): string {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Get the network indicator (local, ic, etc.)
 */
export function getNetwork(): string {
  return import.meta.env.VITE_DFX_NETWORK || 'unknown';
}

/**
 * Check if running in production (IC mainnet)
 */
export function isProduction(): boolean {
  const network = getNetwork();
  return network === 'ic' || window.location.hostname.includes('.ic0.app') || window.location.hostname.includes('.icp0.io');
}

/**
 * Resolve asset path for production-safe loading
 */
export function resolveAssetPath(path: string): string {
  const baseUrl = getBaseUrl();
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure baseUrl ends with slash
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Get environment info for diagnostics
 */
export function getEnvironmentInfo() {
  return {
    baseUrl: getBaseUrl(),
    network: getNetwork(),
    isProduction: isProduction(),
    hostname: window.location.hostname,
    origin: window.location.origin,
  };
}
