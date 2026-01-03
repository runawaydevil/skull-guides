import { useNavigate } from 'react-router-dom';
import { modules, REPO_OWNER, REPO_NAME, REPO_BRANCH, DOCS_PATH } from '../lib/modules';
import { encodePath } from '../lib/githubUrl';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  
  const handleModuleClick = (module: typeof modules[0]) => {
    const path = `${DOCS_PATH}/${module.file}`;
    navigate(`/view/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${encodePath(path)}`);
  };
  
  return (
    <div className="home">
      <div className="home-container">
        <div className="home-header">
          <img src={`${import.meta.env.BASE_URL}sg.png`} alt="skull-guides logo" className="home-logo" />
        </div>
        <p className="home-subtitle">
          Hacking Guide - Ethical Hacking Modules
        </p>
        
        <div className="modules-section">
          <h2 className="modules-title">Modules</h2>
          <ul className="modules-list">
            {modules.map((module) => (
              <li key={module.id}>
                <button
                  className="module-button"
                  onClick={() => handleModuleClick(module)}
                >
                  <span className="module-number">{module.order}</span>
                  <span className="module-name">{module.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
