'use client';

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'disabled';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a4480]';
    
    const variants = {
      default: 'bg-[#0f2744] text-white hover:bg-[#1a4480]',
      primary: 'bg-[#0f2744] text-white hover:bg-[#1a4480]',
      secondary: 'bg-[#1a4480] text-white hover:bg-[#0f2744]',
      outline: 'border-2 border-[#0f2744] text-[#0f2744] hover:bg-[#0f2744] hover:text-white',
      ghost: 'text-[#1a4480] hover:bg-[#1a4480]/10',
      disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl min-h-[56px]',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    
    const isDisabled = disabled || variant === 'disabled';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthClass,
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
