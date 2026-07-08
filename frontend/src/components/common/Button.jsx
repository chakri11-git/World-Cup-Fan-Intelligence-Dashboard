import React from 'react';
import './Button.css';

/**
 * Reusable Premium UI Button Component
 */
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  fullWidth = false 
}) => {
  const buttonClass = `btn btn-${variant} ${fullWidth ? 'btn-block' : ''}`;

  return (
    <button 
      type={type} 
      className={buttonClass} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
