'use client';

import { useHydrationSafe } from '@/lib/hydration-utils';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component to prevent hydration mismatches
 * Only renders children after client-side hydration is complete
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isHydrated = useHydrationSafe();
  
  if (!isHydrated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}