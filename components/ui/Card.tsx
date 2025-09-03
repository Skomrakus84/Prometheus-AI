import React, { useId } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleId?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleId: customTitleId }) => {
  const defaultTitleId = useId();
  const titleId = customTitleId || defaultTitleId;
  
  return (
    <div 
      className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg ${className}`}
      role={title ? 'region' : undefined}
      aria-labelledby={title ? titleId : undefined}
    >
      {title && (
        <div className="p-4 border-b border-gray-700">
          <h3 id={titleId} className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;