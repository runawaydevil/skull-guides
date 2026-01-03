import { useState, useEffect } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import './ShareButton.css';

interface ShareButtonProps {
  headingIds?: string[];
}

export function ShareButton({ headingIds = [] }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const activeSection = useActiveSection(headingIds);

  useEffect(() => {
    // Check if Web Share API is supported
    setShareSupported('share' in navigator);
  }, []);

  // Update URL when section changes
  useEffect(() => {
    if (activeSection) {
      const newUrl = `${window.location.pathname}#${activeSection}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [activeSection]);

  const getShareUrl = (): string => {
    const baseUrl = window.location.origin + window.location.pathname;
    const hash = activeSection ? `#${activeSection}` : window.location.hash;
    return `${baseUrl}${hash}`;
  };

  const handleShare = async () => {
    const url = getShareUrl();
    const title = document.title || 'skull-guides';

    if (shareSupported) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback: show URL in alert
        alert(`Share this link:\n${url}`);
      }
    }
  };

  return (
    <button
      className={`share-button ${copied ? 'share-button-copied' : ''}`}
      onClick={handleShare}
      aria-label="Share this page"
      title={shareSupported ? 'Share' : 'Copy link'}
    >
      {copied ? (
        <>
          <span className="share-icon">✓</span>
          <span className="share-text">Copied!</span>
        </>
      ) : (
        <>
          <span className="share-icon">🔗</span>
          <span className="share-text">{shareSupported ? 'Share' : 'Copy Link'}</span>
        </>
      )}
    </button>
  );
}

