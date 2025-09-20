import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number): string {
  if (typeof window === 'undefined') {
    // Basic formatting for SSR to prevent hydration errors
    return value.toString();
  }
  return new Intl.NumberFormat('en-US').format(value);
}
