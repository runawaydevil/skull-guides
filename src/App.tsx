import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './routes/Home';
import { Viewer } from './routes/Viewer';
import './styles/app.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/:owner/:repo/:branch/*" element={<Viewer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

