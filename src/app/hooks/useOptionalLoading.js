// src/app/hooks/useOptionalLoading.js - Safe hook for admin/special pages
'use client';
import { useCallback, useState, useEffect } from 'react';

// This hook provides loading functionality without requiring the provider
export const useOptionalLoading = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Try to use the main loading context, but provide fallbacks
  const showLoading = useCallback(() => {
    // Only attempt to use loading context on client side
    if (isClient && typeof window !== 'undefined') {
      try {
        // Try to access the loading context if it exists
        const { useLoading } = require('./useLoading');
        const { showLoading } = useLoading();
        showLoading();
      } catch (error) {
        // Silently fail if loading context is not available
        console.log('Loading context not available, using fallback');
      }
    }
  }, [isClient]);

  const hideLoading = useCallback(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        const { useLoading } = require('./useLoading');
        const { hideLoading } = useLoading();
        hideLoading();
      } catch (error) {
        // Silently fail if loading context is not available
        console.log('Loading context not available, using fallback');
      }
    }
  }, [isClient]);

  return {
    showLoading,
    hideLoading,
    isClient,
  };
};