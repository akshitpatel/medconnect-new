import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single class string, 
 * with proper handling of Tailwind CSS classes.
 * 
 * This utility uses clsx for conditional class joining and
 * tailwind-merge to resolve conflicts between Tailwind classes.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <div className={cn('text-red-500', isActive && 'font-bold')} />
 * 
 * // Merge conflicting classes (text-red-500 will be overridden by text-blue-500)
 * <div className={cn('text-red-500', isBlue && 'text-blue-500')} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 