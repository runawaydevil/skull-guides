import { Link } from 'react-router-dom';
import type { RepoTarget } from '../lib/types';
import { getModulesForRepo, DOCS_PATH } from '../lib/modules';
import { encodePath } from '../lib/githubUrl';
import './Breadcrumbs.css';

interface BreadcrumbsProps {
  target: RepoTarget;
  currentSection?: string;
}

export function Breadcrumbs({ target, currentSection }: BreadcrumbsProps) {
  const modules = getModulesForRepo(target.owner, target.repo);
  const currentModule = modules?.find((m) => {
    const modulePath = `${DOCS_PATH}/${m.file}`;
    return target.path === modulePath || target.path.endsWith(m.file);
  });

  const items = [
    { label: 'Home', path: '/' },
  ];

  if (currentModule) {
    items.push({
      label: currentModule.name,
      path: `/view/${target.owner}/${target.repo}/${target.branch}/${encodePath(target.path)}`,
    });
  }

  if (currentSection) {
    items.push({
      label: currentSection,
      path: '',
    });
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumbs-item">
            {index < items.length - 1 ? (
              <>
                <Link to={item.path} className="breadcrumbs-link">
                  {item.label}
                </Link>
                <span className="breadcrumbs-separator" aria-hidden="true">
                  {' '}&gt;{' '}
                </span>
              </>
            ) : (
              <span className="breadcrumbs-current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

