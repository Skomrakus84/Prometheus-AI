import React from 'react';
import Spinner from '/components/ui/Spinner.js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading, icon, ...props }) => {
  return (
    <button
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {icon && <span className="mr-2 -ml-1">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;