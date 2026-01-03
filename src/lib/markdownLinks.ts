import type { RepoTarget } from './types';

/**
 * Check if href is an external link
 */
export function isExternalLink(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}

/**
 * Check if href is an anchor link
 */
export function isAnchorLink(href: string): boolean {
  return href.startsWith('#');
}

/**
 * Check if href points to a markdown file
 */
export function isMarkdownLink(href: string): boolean {
  return /\.md$/i.test(href) || /\.markdown$/i.test(href);
}

/**
 * Check if href points to an image
 */
export function isImageLink(href: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)$/i.test(href);
}

/**
 * Resolve relative path from current file path
 */
export function resolveRelativePath(currentPath: string, href: string): string {
  // External links and anchors stay as-is
  if (isExternalLink(href) || isAnchorLink(href)) {
    return href;
  }
  
  // Absolute path within repo
  if (href.startsWith('/')) {
    return href.slice(1); // Remove leading slash
  }
  
  // Relative path
  const currentDir = currentPath.includes('/')
    ? currentPath.substring(0, currentPath.lastIndexOf('/'))
    : '';
  
  if (!currentDir) {
    return href;
  }
  
  // Resolve relative path
  const parts = currentDir.split('/').concat(href.split('/'));
  const resolved: string[] = [];
  
  for (const part of parts) {
    if (part === '.' || part === '') {
      continue;
    } else if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  
  return resolved.join('/');
}

/**
 * Convert relative image path to raw GitHub URL
 */
export function imageToRawUrl(target: RepoTarget, imagePath: string): string {
  const resolvedPath = resolveRelativePath(target.path, imagePath);
  return `https://raw.githubusercontent.com/${target.owner}/${target.repo}/${target.branch}/${resolvedPath}`;
}

