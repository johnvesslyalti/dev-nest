import React, { type InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <input
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue disabled:cursor-not-allowed disabled:opacity-50 dark:bg-charcoal dark:border-gray-800 dark:text-gray-100 dark:placeholder:text-gray-600 transition-all duration-200",
            error && "border-red-500 focus:ring-red-100 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 ml-1 animate-slide-up font-medium">{error}</p>
        )}
      </div>
    );
  }
);
