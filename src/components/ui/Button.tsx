'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' && 'bg-accent text-white hover:bg-primary',
          variant === 'secondary' && 'bg-secondary text-white hover:bg-muted',
          variant === 'outline' && 'border border-border bg-transparent text-foreground hover:bg-hover',
          variant === 'ghost' && 'bg-transparent text-foreground hover:bg-hover',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-5 text-sm',
          size === 'lg' && 'h-12 px-8 text-base',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
