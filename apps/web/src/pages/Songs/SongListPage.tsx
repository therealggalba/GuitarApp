import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SONGS } from '../../utils/mockSongs';
import './Songs.scss';

const SongListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="song-list-page">
      <h1 className="page-title">Explorar Canciones</h1>
      <div className="songs-grid">
        {MOCK_SONGS.map(song => (
          <div key={song.id} className="song-card">
            <div className="song-info">
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
              <div className={`difficulty-badge ${song.difficulty.toLowerCase()}`}>
                {song.difficulty}
              </div>
            </div>
            <button 
              className="button secondary"
              onClick={() => navigate(`/songs/${song.id}`)}
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongListPage;
