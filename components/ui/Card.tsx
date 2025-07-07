
import React from 'react';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-[var(--bg-card)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl shadow-2xl shadow-black/20 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;