import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string; // Allow additional custom styling
  ariaLabel?: string; // For accessibility
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '', ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || text} // Provide a default aria-label
      className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
