import { useState, useEffect, useRef } from 'react';
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
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (loading === 'eager' || shouldLoad) {
      return;
    }

    const imgElement = imgRef.current;
    if (!imgElement) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image is visible
      }
    );

    observerRef.current.observe(imgElement);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div className={`lazy-image-container ${className || ''}`}>
      {!shouldLoad && (
        <div className="lazy-image-placeholder" aria-hidden="true">
          <div className="lazy-image-skeleton"></div>
        </div>
      )}
      {shouldLoad && (
        <>
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
            style={{ display: isLoaded ? 'block' : 'none' }}
          />
          {hasError && (
            <div className="lazy-image-error">
              <span>Failed to load image</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

