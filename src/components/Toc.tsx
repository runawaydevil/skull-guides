import { useNavigate } from 'react-router-dom';
import type { TocItem } from '../lib/types';
import type { Module } from '../lib/modules';
import type { RepoTarget } from '../lib/types';
import { encodePath } from '../lib/githubUrl';
import { DOCS_PATH } from '../lib/modules';
import './Toc.css';

interface TocProps {
  items: TocItem[];
  modules?: Module[];
  currentPath?: string;
  target?: RepoTarget;
}

export function Toc({ items, modules, currentPath, target }: TocProps) {
  const navigate = useNavigate();
  
  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without triggering navigation
      window.history.pushState(null, '', `#${slug}`);
    }
  };
  
  const handleModuleClick = (e: React.MouseEvent<HTMLAnchorElement>, module: Module) => {
    if (!target) return;
    e.preventDefault();
    const path = `${DOCS_PATH}/${module.file}`;
    navigate(`/view/${target.owner}/${target.repo}/${target.branch}/${encodePath(path)}`);
  };
  
  const hasModules = modules && modules.length > 0;
  const hasHeadings = items.length > 0;
  
  if (!hasModules && !hasHeadings) {
    return null;
  }
  
  // Determine if a module is currently active
  const isModuleActive = (module: Module): boolean => {
    if (!currentPath) return false;
    const modulePath = `${DOCS_PATH}/${module.file}`;
    return currentPath === modulePath || currentPath.endsWith(module.file);
  };
  
  return (
    <nav className="toc">
      <h3 className="toc-title">Table of Contents</h3>
      
      {hasModules && (
        <div className="toc-modules-section">
          <h4 className="toc-section-title">Chapters</h4>
          <ul className="toc-modules-list">
            {modules.map((module) => {
              const isActive = isModuleActive(module);
              return (
                <li key={module.id} className={`toc-module-item ${isActive ? 'toc-module-active' : ''}`}>
                  <a
                    href="#"
                    className="toc-module-link"
                    onClick={(e) => handleModuleClick(e, module)}
                  >
                    <span className="toc-module-number">{module.order}.</span>
                    <span className="toc-module-name">{module.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {hasHeadings && (
        <div className="toc-headings-section">
          {hasModules && <h4 className="toc-section-title">Sections</h4>}
          <ul className="toc-list">
            {items.map((item, index) => (
              <li
                key={index}
                className={`toc-item toc-item-depth-${item.depth}`}
              >
                <a 
                  href={`#${item.slug}`} 
                  className="toc-link"
                  onClick={(e) => handleHeadingClick(e, item.slug)}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

/**
 * Clean text by removing HTML tags and markdown formatting
 */
function cleanText(text: string): string {
  return text
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove markdown bold (**text** or __text__)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove markdown italic (*text* or _text_)
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove markdown code (`code`)
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown strikethrough (~~text~~)
    .replace(/~~([^~]+)~~/g, '$1')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse markdown text and extract headings
 */
export function parseHeadings(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const headings: TocItem[] = [];
  
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      const rawText = match[2].trim();
      const cleanHeadingText = cleanText(rawText);
      const slug = generateSlug(cleanHeadingText);
      
      headings.push({ 
        depth, 
        text: cleanHeadingText, 
        slug 
      });
    }
  }
  
  return headings;
}

/**
 * Generate slug from heading text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

