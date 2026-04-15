'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { generateCode, isValidUrl } from '@/lib/utils';
import type { Link, Stats } from '@/types';

/**
 * Derive the base URL (scheme + host) from the incoming request headers.
 */
async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}

/**
 * Shorten a URL. Returns the generated code and the full short URL.
 */
export async function shortenUrl(
  url: string
): Promise<{ code: string; shortUrl: string }> {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required.');
  }

  const trimmed = url.trim();

  // Auto-prepend https if missing
  const normalized =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  if (!isValidUrl(normalized)) {
    throw new Error('Please enter a valid URL (e.g. https://example.com).');
  }

  // Generate a unique code (retry on collision)
  let code = generateCode();
  let attempts = 0;
  while (db.getLinkByCode(code) && attempts < 5) {
    code = generateCode();
    attempts++;
  }

  db.createLink(code, normalized);

  const baseUrl = await getBaseUrl();
  const shortUrl = `${baseUrl}/${code}`;

  revalidatePath('/');
  revalidatePath('/dashboard');

  return { code, shortUrl };
}

/**
 * Get all links, optionally sorted.
 */
export async function getLinks(
  sortBy: 'clicks' | 'created_at' = 'created_at',
  order: 'asc' | 'desc' = 'desc'
): Promise<Link[]> {
  return db.getAllLinks(sortBy, order);
}

/**
 * Get the 5 most recent links.
 */
export async function getRecentLinks(): Promise<Link[]> {
  return db.getRecentLinks(5);
}

/**
 * Delete a link by its short code.
 */
export async function deleteLink(code: string): Promise<void> {
  if (!code) throw new Error('Code is required.');
  db.deleteLink(code);
  revalidatePath('/');
  revalidatePath('/dashboard');
}

/**
 * Track a click for a given code (fire-and-forget, no revalidation needed).
 */
export function trackClick(code: string): void {
  db.incrementClicks(code);
}

/**
 * Get aggregate stats for the dashboard.
 */
export async function getStats(): Promise<Stats> {
  return {
    totalLinks: db.getTotalLinks(),
    totalClicks: db.getTotalClicks(),
    linksToday: db.getLinksToday(),
  };
}
