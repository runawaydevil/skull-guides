import { ReactNode } from 'react';
import { RepoBadge } from './RepoBadge';
import { Toc, parseHeadings } from './Toc';
import { Footer } from './Footer';
import { FontControls } from './FontControls';
import { Breadcrumbs } from './Breadcrumbs';
import { ShareButton } from './ShareButton';
import type { RepoTarget } from '../lib/types';
import { getModulesForRepo } from '../lib/modules';
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
  const modules = getModulesForRepo(target.owner, target.repo);
  const headingIds = tocItems.map((item) => item.slug);
  
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo-container">
          <img src={`${import.meta.env.BASE_URL}sg.png`} alt="skull-guides logo" className="sidebar-logo" />
        </div>
        <RepoBadge target={target} />
        <Toc 
          items={tocItems} 
          modules={modules || undefined}
          currentPath={target.path}
          target={target}
        />
      </aside>
      
      <main className="main-content">
        <header className="content-header">
          <Breadcrumbs target={target} />
          <div className="content-header-top">
            <h1 className="file-title">{fileName}</h1>
            <div className="content-header-actions">
              <ShareButton headingIds={headingIds} />
              <FontControls />
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
            </div>
          </div>
        </header>
        
        <div className="content-body">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

