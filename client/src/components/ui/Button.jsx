import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)]",
    secondary: "bg-[var(--color-card)] text-[var(--color-heading)] hover:bg-[var(--color-border)] focus:ring-[var(--color-border)] border border-[var(--color-border)]",
    ghost: "bg-transparent text-[var(--color-secondary)] hover:text-[var(--color-heading)] hover:bg-[var(--color-card)]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
