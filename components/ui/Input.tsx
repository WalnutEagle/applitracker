
import React from 'react';
import { InputProps } from '../../types';

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-main)] mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-dark)] placeholder-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--focus-ring)] transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;