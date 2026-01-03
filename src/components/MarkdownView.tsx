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
import './MarkdownView.css';
import 'highlight.js/styles/default.css';

interface MarkdownViewProps {
  content: string;
  target: RepoTarget;
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
    <div className="markdown-view">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          rehypeHighlight,
        ]}
        components={{
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
            if (!src) return <img {...props} alt={alt} />;
            
            // Convert relative images to raw GitHub URL
            const imageSrc = isExternalLink(src)
              ? src
              : imageToRawUrl(target, src);
            
            return (
              <img
                {...props}
                src={imageSrc}
                alt={alt}
                loading="lazy"
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
  );
}

