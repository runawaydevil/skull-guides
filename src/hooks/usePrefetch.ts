import { useEffect } from 'react';
import type { RepoTarget } from '../lib/types';
import { fetchMarkdown } from '../lib/fetchers';
import { getModulesForRepo, DOCS_PATH } from '../lib/modules';

/**
 * Hook to prefetch adjacent modules in the background
 */
export function usePrefetch(target: RepoTarget | null) {
  useEffect(() => {
    try {
      if (!target || !target.owner || !target.repo) return;
      
      const modules = getModulesForRepo(target.owner, target.repo);
      if (!modules) return;

      // Find current module
      const currentModule = modules.find((m) => {
        const modulePath = `${DOCS_PATH}/${m.file}`;
        return target.path === modulePath || target.path.endsWith(m.file);
      });

      if (!currentModule) return;

      // Find previous and next modules
      const currentIndex = modules.findIndex((m) => m.id === currentModule.id);
      const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
      const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

      // Prefetch previous module
      if (prevModule) {
        const prevPath = `${DOCS_PATH}/${prevModule.file}`;
        const prevTarget: RepoTarget = {
          owner: target.owner,
          repo: target.repo,
          branch: target.branch,
          path: prevPath,
        };
        
        // Prefetch in background (don't await)
        fetchMarkdown(prevTarget).catch(() => {
          // Silently fail - prefetch is optional
        });
      }

      // Prefetch next module
      if (nextModule) {
        const nextPath = `${DOCS_PATH}/${nextModule.file}`;
        const nextTarget: RepoTarget = {
          owner: target.owner,
          repo: target.repo,
          branch: target.branch,
          path: nextPath,
        };
        
        // Prefetch in background (don't await)
        fetchMarkdown(nextTarget).catch(() => {
          // Silently fail - prefetch is optional
        });
      }
    } catch (error) {
      // Silently fail - prefetch is optional and shouldn't break the app
      console.error('Error in usePrefetch:', error);
    }
  }, [target]);
}

