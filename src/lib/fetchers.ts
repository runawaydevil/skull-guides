import type { RepoTarget, FetchError } from './types';
import { toRawUrl } from './githubUrl';
import {
  getFromMemoryCache,
  setMemoryCache,
  getFromStorageCache,
  setStorageCache,
} from './cache';

/**
 * Fetch markdown content with cache
 * Priority: memory cache → localStorage cache → network
 */
export async function fetchMarkdown(target: RepoTarget): Promise<string> {
  const rawUrl = toRawUrl(target);
  
  // Try memory cache first
  const memoryCached = getFromMemoryCache(rawUrl);
  if (memoryCached) {
    return memoryCached;
  }
  
  // Try localStorage cache
  const storageCached = getFromStorageCache(rawUrl);
  if (storageCached) {
    // Also populate memory cache
    setMemoryCache(rawUrl, storageCached);
    return storageCached;
  }
  
  // Fetch from network
  try {
    const response = await fetch(rawUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${rawUrl}: ${response.status} ${response.statusText}`);
      const error: FetchError = {
        status: response.status,
        message: getErrorMessage(response.status),
      };
      throw error;
    }
    
    const text = await response.text();
    
    // Cache in both layers
    setMemoryCache(rawUrl, text);
    setStorageCache(rawUrl, text);
    
    return text;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    // Network error
    console.error(`Network error fetching ${rawUrl}:`, error);
    throw {
      status: 0,
      message: `Network error. Please check your connection. URL: ${rawUrl}`,
    } as FetchError;
  }
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(status: number): string {
  switch (status) {
    case 404:
      return 'File not found. The repository may not exist on GitHub or the file path is incorrect. Make sure the repository is public and the files are committed.';
    case 403:
    case 429:
      return 'Rate limit exceeded. Please try again later.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'GitHub service unavailable. Please try again later.';
    default:
      return `Error ${status}. Please try again.`;
  }
}

