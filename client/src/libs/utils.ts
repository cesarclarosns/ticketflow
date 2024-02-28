import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(str: string, numInitials: number = 2) {
  return str
    .split(' ')
    .reduce((prev, curr) => {
      if (prev.length >= numInitials) return prev;
      prev.push(curr);
      return prev;
    }, [] as string[])
    .map((str) => str[0])
    .join('')
    .toUpperCase();
}

export function formatCompactNumber(number: number): number | string {
  if (number < 0) {
    return '-' + formatCompactNumber(-1 * number);
  }
  if (number < 1_000) {
    return number;
  } else if (number >= 1_000 && number < 1_000_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else {
    return (number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
  }
}
