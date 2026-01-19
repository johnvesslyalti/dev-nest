import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white dark:bg-charcoal/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800/60 shadow-sm dark:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
};
