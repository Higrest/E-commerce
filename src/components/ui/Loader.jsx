import React from 'react';

export const Loader = ({ fullScreen = false }) => {
  const containerStyles = fullScreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center' 
    : 'flex items-center justify-center py-12 w-full';

  return (
    <div className={containerStyles}>
      <div className="relative flex items-center justify-center">
        {/* Внешнее пульсирующее кольцо */}
        <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-25"></div>
        {/* Основной крутящийся спиннер */}
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-100 border-t-blue-600"></div>
      </div>
    </div>
  );
};
