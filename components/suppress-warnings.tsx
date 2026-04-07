'use client';

import { useEffect } from 'react';

export function SuppressWarnings() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalWarn = console.warn;
    console.warn = (...args) => {
      const msg = typeof args[0] === 'string' ? args[0] : '';
      if (
        msg.includes('THREE.Clock: This module has been deprecated') ||
        msg.includes('THREE.THREE.Clock:') ||
        msg.includes('using deprecated parameters for the initialization function')
      ) {
        return;
      }
      originalWarn(...args);
    };

    const originalError = console.error;
    console.error = (...args) => {
      const msg = typeof args[0] === 'string' ? args[0] : '';
      if (
        msg.includes('THREE.Clock: This module has been deprecated') ||
        msg.includes('THREE.THREE.Clock:') ||
        msg.includes('using deprecated parameters for the initialization function')
      ) {
        return;
      }
      originalError(...args);
    };
  }, []);

  return null;
}
