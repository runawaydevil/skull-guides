import type { RepoTarget } from '../lib/types';
import { toBlobUrl } from '../lib/githubUrl';
import './RepoBadge.css';

interface RepoBadgeProps {
  target: RepoTarget;
}

export function RepoBadge({ target }: RepoBadgeProps) {
  const blobUrl = toBlobUrl(target);
  
  return (
    <div className="repo-badge">
      <a
        href={blobUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="repo-link"
      >
        <span className="repo-owner">{target.owner}</span>
        <span className="repo-separator">/</span>
        <span className="repo-name">{target.repo}</span>
        <span className="repo-branch">@{target.branch}</span>
      </a>
    </div>
  );
}

