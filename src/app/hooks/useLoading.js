// src/app/hooks/useLoading.js - React 19 compatible
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext(undefined);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const pathname = usePathname();
  
  // Stable callback functions to prevent unnecessary re-renders
  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);
  
  const hideLoading = useCallback(() => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
    setIsLoading(false);
  }, [loadingTimeout]);
  
  // Handle route changes with proper cleanup
  useEffect(() => {
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    // Show loading immediately on route change
    setIsLoading(true);
    
    // Set a minimum loading time and maximum timeout
    const minLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Minimum 800ms loading
    
    const maxLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Maximum 3s loading
    
    setLoadingTimeout(maxLoadingTimer);
    
    // Cleanup function
    return () => {
      clearTimeout(minLoadingTimer);
      clearTimeout(maxLoadingTimer);
    };
  }, [pathname]); // Remove loadingTimeout from dependencies to avoid infinite loop
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);
  
  const contextValue = {
    isLoading,
    showLoading,
    hideLoading,
  };
  
  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};