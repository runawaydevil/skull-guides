import { useEffect, useState } from 'react';

/**
 * Hook to detect which section is currently active based on scroll position
 */
export function useActiveSection(headingIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headingIds.length === 0) return;

    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px', // Trigger when heading is near top
      threshold: 0,
    };

    const observers = new Map<string, IntersectionObserver>();

    const handleIntersection = (id: string) => (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(id);
        }
      });
    };

    // Create observers for each heading
    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(handleIntersection(id), observerOptions);
        observer.observe(element);
        observers.set(id, observer);
      }
    });

    // Fallback: check scroll position on scroll
    const handleScroll = () => {
      let current: string | null = null;
      let maxTop = -Infinity;

      headingIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.top > maxTop) {
            maxTop = rect.top;
            current = id;
          }
        }
      });

      if (current) {
        setActiveId(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headingIds]);

  return activeId;
}

