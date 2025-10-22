// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This is a standard utility for combining Tailwind classes. Very useful.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Our specific date formatting utility
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Format for the large date display (e.g., APR 14)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();

  // Format for the day of the week (e.g., Sunday)
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

  // Format for the time range (extract from description as a fallback, or use date time)
  // For the sake of this example, we'll extract it, but ideally, it would be its own field.
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);

  return {
    month,
    day: day.toString(),
    dayOfWeek,
    time
  };
};