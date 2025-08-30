import { useState, useEffect } from 'react';

/**
 * Hook to handle hydration-safe client-only rendering
 * Prevents hydration mismatches by only rendering on client after hydration
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Generate a stable ID that works across server/client
 * Uses a counter instead of Date.now() to avoid hydration issues
 */
let messageIdCounter = 1;

export function generateMessageId(): string {
  return `msg_${messageIdCounter++}`;
}

/**
 * Format timestamp in a hydration-safe way
 * Only formats on client side after hydration
 */
export function formatTimestamp(timestamp: string): string {
  if (typeof window === 'undefined') {
    return ''; // Return empty string on server
  }
  
  try {
    return new Date(timestamp).toLocaleTimeString();
  } catch {
    return '';
  }
}

/**
 * Get current timestamp in a consistent format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}