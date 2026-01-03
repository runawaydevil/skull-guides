export interface RepoTarget {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export interface CacheEntry {
  text: string;
  ts: number;
}

export interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

export interface FetchError {
  status: number;
  message: string;
}

