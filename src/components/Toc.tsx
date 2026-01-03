import type { TocItem } from '../lib/types';
import './Toc.css';

interface TocProps {
  items: TocItem[];
}

export function Toc({ items }: TocProps) {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <nav className="toc">
      <h3 className="toc-title">Table of Contents</h3>
      <ul className="toc-list">
        {items.map((item, index) => (
          <li
            key={index}
            className={`toc-item toc-item-depth-${item.depth}`}
          >
            <a href={`#${item.slug}`} className="toc-link">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
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
      const text = match[2].trim();
      const slug = generateSlug(text);
      
      headings.push({ depth, text, slug });
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

