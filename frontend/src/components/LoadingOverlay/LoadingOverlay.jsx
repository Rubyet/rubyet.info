import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-message">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
