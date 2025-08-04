// src/app/hooks/useLoading.js - SSR-safe version
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext(undefined);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  
  // Prevent SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Stable callback functions to prevent unnecessary re-renders
  const showLoading = useCallback(() => {
    if (isClient) {
      setIsLoading(true);
    }
  }, [isClient]);
  
  const hideLoading = useCallback(() => {
    if (isClient) {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
      setIsLoading(false);
    }
  }, [isClient, loadingTimeout]);
  
  // Handle route changes with proper cleanup - only on client
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [pathname, isClient]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);
  
  const contextValue = {
    isLoading: isClient ? isLoading : false,
    showLoading,
    hideLoading,
  };
  
  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

// SSR-safe hook with fallback
export const useLoading = () => {
  const context = useContext(LoadingContext);
  
  // Provide safe fallbacks for SSR
  if (context === undefined) {
    console.warn('useLoading must be used within a LoadingProvider. Providing fallback.');
    return {
      isLoading: false,
      showLoading: () => {},
      hideLoading: () => {},
    };
  }
  
  return context;
};