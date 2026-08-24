'use client';

import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'category';
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  dot = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-semibold text-[11px] px-3 py-1 rounded-full transition-colors';

  const variantStyles = {
    default: 'bg-stone-100 text-stone-800 border border-stone-200/80',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/60',
    category: 'bg-white/95 backdrop-blur-md text-stone-900 border border-stone-100 shadow-sm',
  };

  const dotColors = {
    default: 'bg-stone-500',
    success: 'bg-emerald-500 animate-pulse',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    category: 'bg-[#0D5C53]',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export default Badge;
