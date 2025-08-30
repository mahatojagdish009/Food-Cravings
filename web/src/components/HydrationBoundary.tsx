'use client';

import { useEffect, useState } from 'react';

interface HydrationBoundaryProps {
  children: React.ReactNode;
}

/**
 * Boundary component that handles hydration mismatches caused by browser extensions
 * Specifically addresses issues with Grammarly and other extensions that modify the DOM
 */
export function HydrationBoundary({ children }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Clean up any browser extension artifacts that might cause hydration issues
    const cleanupExtensionAttributes = () => {
      if (typeof document !== 'undefined') {
        const body = document.body;
        
        // Remove common Grammarly attributes that cause hydration mismatches
        const grammarly_attributes = [
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed',
          'data-new-gr-c-s-loaded'
        ];
        
        grammarly_attributes.forEach(attr => {
          if (body.hasAttribute(attr)) {
            body.removeAttribute(attr);
          }
        });
      }
    };

    // Clean up on mount
    cleanupExtensionAttributes();
    
    // Mark as hydrated
    setIsHydrated(true);

    // Set up a mutation observer to clean up extension interference
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target === document.body) {
          const attributeName = mutation.attributeName;
          if (attributeName && attributeName.startsWith('data-gr-') || attributeName?.startsWith('data-new-gr-')) {
            cleanupExtensionAttributes();
          }
        }
      });
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: [
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed', 
          'data-new-gr-c-s-loaded'
        ]
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isHydrated) {
    return <div style={{ opacity: 0 }}>{children}</div>;
  }

  return <>{children}</>;
}