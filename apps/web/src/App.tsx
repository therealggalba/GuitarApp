import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SongListPage from './pages/Songs/SongListPage';
import SongDetailPage from './pages/Songs/SongDetailPage';
import SongSyncPage from './pages/Songs/SongSyncPage';
import './styles/main.scss';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<SongListPage />} />
          <Route path="/songs/:id" element={<SongDetailPage />} />
          <Route path="/songs/:id/sync" element={<SongSyncPage />} />
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404</h1>
              <p>Page Not Found</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
