import { useNavigate } from 'react-router-dom';
import type { RepoTarget } from '../lib/types';
import { getModulesForRepo, DOCS_PATH } from '../lib/modules';
import { encodePath } from '../lib/githubUrl';
import './ModuleNavigation.css';

interface ModuleNavigationProps {
  target: RepoTarget;
}

export function ModuleNavigation({ target }: ModuleNavigationProps) {
  const navigate = useNavigate();
  const modules = getModulesForRepo(target.owner, target.repo);
  
  if (!modules) return null;

  // Find current module
  const currentModule = modules.find((m) => {
    const modulePath = `${DOCS_PATH}/${m.file}`;
    return target.path === modulePath || target.path.endsWith(m.file);
  });

  if (!currentModule) return null;

  // Find previous and next modules
  const currentIndex = modules.findIndex((m) => m.id === currentModule.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const handleNavigate = (module: typeof modules[0]) => {
    const path = `${DOCS_PATH}/${module.file}`;
    navigate(`/view/${target.owner}/${target.repo}/${target.branch}/${encodePath(path)}`);
  };

  return (
    <nav className="module-navigation" aria-label="Module navigation">
      {prevModule ? (
        <button
          className="module-nav-button module-nav-prev"
          onClick={() => handleNavigate(prevModule)}
          aria-label={`Previous: ${prevModule.name}`}
        >
          <span className="module-nav-arrow">←</span>
          <div className="module-nav-content">
            <span className="module-nav-label">Previous</span>
            <span className="module-nav-name">{prevModule.name}</span>
          </div>
        </button>
      ) : (
        <div className="module-nav-spacer"></div>
      )}
      
      {nextModule && (
        <button
          className="module-nav-button module-nav-next"
          onClick={() => handleNavigate(nextModule)}
          aria-label={`Next: ${nextModule.name}`}
        >
          <div className="module-nav-content">
            <span className="module-nav-label">Next</span>
            <span className="module-nav-name">{nextModule.name}</span>
          </div>
          <span className="module-nav-arrow">→</span>
        </button>
      )}
    </nav>
  );
}

