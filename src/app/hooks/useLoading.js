// src/app/hooks/useLoading.js - Ultra-safe SSR version
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext(undefined);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Use try-catch for pathname to handle SSR edge cases
  let pathname = '/';
  try {
    pathname = usePathname();
  } catch (error) {
    // Fallback for SSR or edge cases
    console.log('Pathname not available during SSR');
  }
  
  // Client-side detection
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Stable callback functions
  const showLoading = useCallback(() => {
    if (typeof window !== 'undefined' && isClient) {
      setIsLoading(true);
    }
  }, [isClient]);
  
  const hideLoading = useCallback(() => {
    if (typeof window !== 'undefined' && isClient) {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
      setIsLoading(false);
    }
  }, [isClient, loadingTimeout]);
  
  // Handle route changes - only on client
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    // Show loading immediately on route change
    setIsLoading(true);
    
    // Set timers
    const minLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    const maxLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    setLoadingTimeout(maxLoadingTimer);
    
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

// Ultra-safe hook that never throws
export const useLoading = () => {
  // Add extra safety checks
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      isLoading: false,
      showLoading: () => {},
      hideLoading: () => {},
    };
  }
  
  try {
    const context = useContext(LoadingContext);
    
    if (context === undefined) {
      // Fallback if no provider
      console.warn('useLoading used outside provider, providing fallback');
      return {
        isLoading: false,
        showLoading: () => {},
        hideLoading: () => {},
      };
    }
    
    return context;
  } catch (error) {
    // Catch any unexpected errors
    console.warn('Error in useLoading hook:', error);
    return {
      isLoading: false,
      showLoading: () => {},
      hideLoading: () => {},
    };
  }
};