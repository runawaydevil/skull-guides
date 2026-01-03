import { ReactNode } from 'react';
import { RepoBadge } from './RepoBadge';
import { Toc, parseHeadings } from './Toc';
import { Footer } from './Footer';
import type { RepoTarget } from '../lib/types';
import './Layout.css';

interface LayoutProps {
  target: RepoTarget;
  content: string;
  children: ReactNode;
  onOpenGitHub?: () => void;
}

export function Layout({ target, content, children, onOpenGitHub }: LayoutProps) {
  const tocItems = parseHeadings(content);
  const fileName = target.path.split('/').pop() || target.path;
  
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo-container">
          <img src={`${import.meta.env.BASE_URL}sg.png`} alt="skull-guides logo" className="sidebar-logo" />
        </div>
        <RepoBadge target={target} />
        <Toc items={tocItems} />
      </aside>
      
      <main className="main-content">
        <header className="content-header">
          <h1 className="file-title">{fileName}</h1>
          {onOpenGitHub && (
            <a
              href={`https://github.com/${target.owner}/${target.repo}/blob/${target.branch}/${target.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-button"
            >
              Open on GitHub
            </a>
          )}
        </header>
        
        <div className="content-body">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

