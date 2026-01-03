import { useState, useRef, useEffect } from 'react';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function LazyImage({ src, alt, className, loading = 'lazy' }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  // Check if image is already loaded (from cache) after mount
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // If image is already complete (cached), mark as loaded immediately
    if (img.complete && img.naturalHeight !== 0) {
      setIsLoaded(true);
      return;
    }

    // Fallback: if onLoad doesn't fire after 3 seconds, show image anyway
    const timeout = setTimeout(() => {
      if (!isLoaded && !hasError) {
        setIsLoaded(true);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoaded, hasError]);

  try {
    return (
      <div className={`lazy-image-container ${className || ''}`}>
        {!isLoaded && !hasError && (
          <div className="lazy-image-placeholder" aria-hidden="true">
            <div className="lazy-image-spinner"></div>
          </div>
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'lazy-image-loaded' : 'lazy-image-loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          style={{ 
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
        {hasError && (
          <div className="lazy-image-error">
            <span>Failed to load image</span>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering LazyImage:', error);
    // Fallback: render simple img tag
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    );
  }
}

