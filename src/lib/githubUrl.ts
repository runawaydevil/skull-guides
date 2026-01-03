import type { RepoTarget } from './types';

/**
 * Parse GitHub input URL or short format
 * Supports:
 * - https://github.com/owner/repo/blob/branch/path.md
 * - https://raw.githubusercontent.com/owner/repo/branch/path.md
 * - owner/repo@branch:path.md
 */
export function parseGitHubInput(input: string): RepoTarget | null {
  const trimmed = input.trim();
  
  // Format 1: blob URL
  // https://github.com/owner/repo/blob/branch/path/to/file.md
  const blobMatch = trimmed.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);
  if (blobMatch) {
    return {
      owner: blobMatch[1],
      repo: blobMatch[2],
      branch: blobMatch[3],
      path: blobMatch[4],
    };
  }
  
  // Format 2: raw URL
  // https://raw.githubusercontent.com/owner/repo/branch/path/to/file.md
  const rawMatch = trimmed.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/);
  if (rawMatch) {
    return {
      owner: rawMatch[1],
      repo: rawMatch[2],
      branch: rawMatch[3],
      path: rawMatch[4],
    };
  }
  
  // Format 3: short format
  // owner/repo@branch:path/to/file.md
  const shortMatch = trimmed.match(/^([^\/@]+)\/([^@]+)@([^:]+):(.+)$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
      branch: shortMatch[3],
      path: shortMatch[4],
    };
  }
  
  return null;
}

/**
 * Convert RepoTarget to raw GitHub URL
 */
export function toRawUrl(target: RepoTarget): string {
  return `https://raw.githubusercontent.com/${target.owner}/${target.repo}/${target.branch}/${target.path}`;
}

/**
 * Convert RepoTarget to blob GitHub URL
 */
export function toBlobUrl(target: RepoTarget): string {
  return `https://github.com/${target.owner}/${target.repo}/blob/${target.branch}/${target.path}`;
}

/**
 * Encode path for URL (handles special characters)
 */
export function encodePath(path: string): string {
  return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
}

/**
 * Decode path from URL
 */
export function decodePath(path: string): string {
  return path.split('/').map(segment => decodeURIComponent(segment)).join('/');
}

