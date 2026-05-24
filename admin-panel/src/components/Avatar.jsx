import React from 'react';
import { getInitials, getColorFromString } from '../utils/formatting';

/**
 * Professional Avatar Component
 * Displays user initials in a colored circle
 */
export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = getInitials(name);
  const colorClass = getColorFromString(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
