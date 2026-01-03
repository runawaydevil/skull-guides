import type { CacheEntry } from './types';

const MEMORY_CACHE = new Map<string, CacheEntry>();
const CACHE_PREFIX = 'skull-guides:v1:';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cache key for localStorage
 */
function getStorageKey(rawUrl: string): string {
  return `${CACHE_PREFIX}${rawUrl}`;
}

/**
 * Check if cache entry is expired
 */
function isExpired(entry: CacheEntry): boolean {
  return Date.now() - entry.ts > TTL_MS;
}

/**
 * Get from memory cache
 */
export function getFromMemoryCache(rawUrl: string): string | null {
  const entry = MEMORY_CACHE.get(rawUrl);
  if (!entry || isExpired(entry)) {
    MEMORY_CACHE.delete(rawUrl);
    return null;
  }
  return entry.text;
}

/**
 * Set in memory cache
 */
export function setMemoryCache(rawUrl: string, text: string): void {
  MEMORY_CACHE.set(rawUrl, {
    text,
    ts: Date.now(),
  });
}

/**
 * Get from localStorage cache
 */
export function getFromStorageCache(rawUrl: string): string | null {
  try {
    const key = getStorageKey(rawUrl);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const entry: CacheEntry = JSON.parse(stored);
    if (isExpired(entry)) {
      localStorage.removeItem(key);
      return null;
    }
    
    return entry.text;
  } catch {
    return null;
  }
}

/**
 * Set in localStorage cache
 */
export function setStorageCache(rawUrl: string, text: string): void {
  try {
    const key = getStorageKey(rawUrl);
    const entry: CacheEntry = {
      text,
      ts: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    // localStorage might be full or unavailable
    console.warn('Failed to set storage cache:', e);
  }
}

/**
 * Clear all caches
 */
export function clearCache(): void {
  MEMORY_CACHE.clear();
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore
  }
}

