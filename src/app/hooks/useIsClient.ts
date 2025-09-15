'use client';

import { useEffect, useState } from 'react';

// Hook to safely detect if we're on the client side
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}; 