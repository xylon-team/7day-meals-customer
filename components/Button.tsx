'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variantStyles = {
    primary: 'bg-[#0D5C53] hover:bg-[#09433D] text-white hover:shadow',
    secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-800',
    outline: 'border border-stone-300 hover:bg-stone-50 text-stone-700',
    ghost: 'hover:bg-stone-100 text-stone-700 shadow-none',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5',
    md: 'text-xs px-5 py-2.5',
    lg: 'text-sm px-6 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
