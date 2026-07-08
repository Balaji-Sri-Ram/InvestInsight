import React from 'react';
import { cn } from '../../utils/cn';

export const Spinner = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-[var(--color-primary)] border-r-[var(--color-primary)] border-b-[var(--color-primary)]/20 border-l-[var(--color-primary)]/20',
        sizes[size],
        className
      )}
      role="status"
      aria-label="loading"
    />
  );
};
