
import React from 'react';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'secondary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-main)] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-[var(--primary-600)] text-[var(--text-dark)] hover:bg-[var(--primary-700)] focus:ring-[var(--focus-ring)]',
    secondary: 'bg-[var(--secondary-600)] text-[var(--text-main)] hover:bg-[var(--secondary-500)] focus:ring-[var(--secondary-500)]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-[var(--text-light)] hover:bg-[var(--secondary-600)]/50 focus:ring-[var(--secondary-500)]',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;