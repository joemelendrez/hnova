// src/components/RouteLoadingProvider.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

const RouteLoadingContext = createContext({});

export function RouteLoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Show loading on route changes
  useEffect(() => {
    setIsLoading(true);
    
    // Hide loading after a short delay (simulates page load)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <RouteLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <LoadingScreen isVisible={isLoading} />
      {children}
    </RouteLoadingContext.Provider>
  );
}

export function useRouteLoading() {
  return useContext(RouteLoadingContext);
}