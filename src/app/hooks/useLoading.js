// src/app/hooks/useLoading.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const pathname = usePathname();

  // Show loading on route changes
  useEffect(() => {
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    // Show loading immediately on route change
    setIsLoading(true);

    // Set a minimum loading time and maximum timeout
    const minLoadingTime = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Minimum 800ms loading

    const maxLoadingTime = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Maximum 3s loading

    setLoadingTimeout(maxLoadingTime);

    return () => {
      clearTimeout(minLoadingTime);
      clearTimeout(maxLoadingTime);
    };
  }, [pathname]);

  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};