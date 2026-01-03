import { useNavigate } from 'react-router-dom';
import { modules, REPO_OWNER, REPO_NAME, REPO_BRANCH, DOCS_PATH } from '../lib/modules';
import { encodePath } from '../lib/githubUrl';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  
  const handleAccessContent = () => {
    // Navigate to first module
    const firstModule = modules[0];
    if (firstModule) {
      const path = `${DOCS_PATH}/${firstModule.file}`;
      navigate(`/view/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${encodePath(path)}`);
    }
  };
  
  return (
    <div className="home">
      <div className="home-container">
        <div className="home-header">
          <img src={`${import.meta.env.BASE_URL}sg.png`} alt="skull-guides logo" className="home-logo" />
        </div>
        <button className="access-content-button" onClick={handleAccessContent}>
          Access Content
        </button>
      </div>
    </div>
  );
}
