import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [activeRequests, setActiveRequests] = useState(0);

  const startLoading = (message = 'Loading...') => {
    setActiveRequests(prev => prev + 1);
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setActiveRequests(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  const value = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    setLoadingMessage,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
