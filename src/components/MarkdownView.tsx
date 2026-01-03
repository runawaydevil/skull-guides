import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import type { RepoTarget } from '../lib/types';
import {
  isMarkdownLink,
  isExternalLink,
  isAnchorLink,
  resolveRelativePath,
  imageToRawUrl,
} from '../lib/markdownLinks';
import { encodePath } from '../lib/githubUrl';
import { LazyImage } from './LazyImage';
import { ModuleNavigation } from './ModuleNavigation';
import './MarkdownView.css';
import 'highlight.js/styles/default.css';

interface MarkdownViewProps {
  content: string;
  target: RepoTarget;
}

/**
 * Extract text content from React children recursively
 */
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText((children as React.ReactElement).props.children);
  }
  return '';
}

/**
 * Clean text by removing HTML tags (same as in Toc.tsx)
 */
function cleanText(text: string): string {
  return text
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate slug from heading text (same logic as in Toc.tsx)
 */
function generateSlug(children: React.ReactNode): string {
  let textContent = extractText(children);
  // Clean HTML tags that might be present
  textContent = cleanText(textContent);
  
  return textContent
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export function MarkdownView({ content, target }: MarkdownViewProps) {
  const navigate = useNavigate();
  
  const handleLinkClick = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    // Anchor links - let browser handle
    if (isAnchorLink(href)) {
      return;
    }
    
    // External links - open in new tab
    if (isExternalLink(href)) {
      return; // Let default behavior happen
    }
    
    // Check if it's a markdown link
    if (isMarkdownLink(href)) {
      event.preventDefault();
      const resolvedPath = resolveRelativePath(target.path, href);
      
      // Navigate to new markdown file
      navigate(
        `/view/${target.owner}/${target.repo}/${target.branch}/${encodePath(resolvedPath)}`
      );
    }
  };
  
  return (
    <>
      <div className="markdown-view">
        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          rehypeHighlight,
        ]}
        components={{
          h1: ({ children, ...props }) => {
            const id = generateSlug(children);
            return <h1 id={id} {...props}>{children}</h1>;
          },
          h2: ({ children, ...props }) => {
            const id = generateSlug(children);
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const id = generateSlug(children);
            return <h3 id={id} {...props}>{children}</h3>;
          },
          h4: ({ children, ...props }) => {
            const id = generateSlug(children);
            return <h4 id={id} {...props}>{children}</h4>;
          },
          h5: ({ children, ...props }) => {
            const id = generateSlug(children);
            return <h5 id={id} {...props}>{children}</h5>;
          },
          h6: ({ children, ...props }) => {
            const id = generateSlug(children);
            return <h6 id={id} {...props}>{children}</h6>;
          },
          a: ({ href, children, ...props }) => {
            if (!href) return <a {...props}>{children}</a>;
            
            const isExternal = isExternalLink(href);
            const isMarkdown = isMarkdownLink(href);
            
            return (
              <a
                {...props}
                href={href}
                onClick={(e) => handleLinkClick(href, e)}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={isMarkdown ? 'markdown-link' : undefined}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt, ...props }) => {
            if (!src) return null;
            
            // Convert relative images to raw GitHub URL
            const imageSrc = isExternalLink(src)
              ? src
              : imageToRawUrl(target, src);
            
            return (
              <LazyImage
                src={imageSrc}
                alt={alt}
                className={props.className}
              />
            );
          },
          code: ({ className, children, ...props }) => {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
          {content}
        </ReactMarkdown>
      </div>
      <ModuleNavigation target={target} />
    </>
  );
}

