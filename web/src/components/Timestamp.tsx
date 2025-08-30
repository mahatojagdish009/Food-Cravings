'use client';

import { useHydrationSafe } from '@/lib/hydration-utils';

interface TimestampProps {
  timestamp: string;
  className?: string;
}

export function Timestamp({ timestamp, className = '' }: TimestampProps) {
  const isHydrated = useHydrationSafe();
  
  if (!isHydrated) {
    // Return a placeholder during SSR to maintain layout
    return <span className={className}>--:--</span>;
  }
  
  try {
    const formattedTime = new Date(timestamp).toLocaleTimeString();
    return <span className={className}>{formattedTime}</span>;
  } catch {
    return <span className={className}>--:--</span>;
  }
}