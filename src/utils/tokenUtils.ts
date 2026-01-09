/**
 * Token utility functions for managing authentication tokens
 */

/**
 * Check if the access token is expired or about to expire
 * @param tokenExpiryTime - The expiry timestamp in milliseconds
 * @param bufferTime - Buffer time in seconds before expiry (default: 60 seconds)
 * @returns true if token is expired or about to expire
 */
export const isTokenExpired = (
  tokenExpiryTime?: number,
  bufferTime: number = 60
): boolean => {
  if (!tokenExpiryTime) {
    return true;
  }

  const now = Date.now();
  const bufferMs = bufferTime * 1000;

  // Return true if token will expire within buffer time
  return now >= tokenExpiryTime - bufferMs;
};

/**
 * Get the remaining time until token expiry
 * @param tokenExpiryTime - The expiry timestamp in milliseconds
 * @returns Remaining time in seconds, or 0 if expired
 */
export const getRemainingTokenTime = (tokenExpiryTime?: number): number => {
  if (!tokenExpiryTime) {
    return 0;
  }

  const now = Date.now();
  const remaining = Math.max(0, tokenExpiryTime - now);

  return Math.floor(remaining / 1000); // Convert to seconds
};

/**
 * Format remaining time as human-readable string
 * @param tokenExpiryTime - The expiry timestamp in milliseconds
 * @returns Formatted string like "5m 30s" or "Expired"
 */
export const formatRemainingTime = (tokenExpiryTime?: number): string => {
  const seconds = getRemainingTokenTime(tokenExpiryTime);

  if (seconds <= 0) {
    return "Expired";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
};

/**
 * Get user tokens from localStorage
 * @returns User object with tokens or null
 */
export const getUserTokens = (): {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiryTime?: number;
} | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storage = localStorage.getItem("edutech-storage");
    if (!storage) {
      return null;
    }

    const { state } = JSON.parse(storage);
    return state?.user || null;
  } catch {
    return null;
  }
};
