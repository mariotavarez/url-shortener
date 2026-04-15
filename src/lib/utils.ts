import { nanoid } from 'nanoid';

/**
 * Generate a short, URL-safe code (6 characters by default)
 */
export function generateCode(length = 6): string {
  return nanoid(length);
}

/**
 * Format a datetime string into a human-readable date
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Validate a URL string
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Truncate a string to a max length with ellipsis
 */
export function truncate(str: string, max = 50): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + '...';
}

/**
 * Build the full short URL from a code
 */
export function buildShortUrl(baseUrl: string, code: string): string {
  return `${baseUrl.replace(/\/$/, '')}/${code}`;
}
