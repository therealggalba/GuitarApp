import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SONGS } from '../../utils/mockSongs';
import AudioConsole from '../../components/AudioPlayer/AudioConsole';
import KaraokeDisplay from '../../components/Lyrics/KaraokeDisplay';

const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(0);
  
  const song = MOCK_SONGS.find(s => s.id === id);

  if (!song) {
    return (
      <div className="not-found">
        <h2>Canción no encontrada</h2>
        <button className="button" onClick={() => navigate('/songs')}>
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="song-detail-page">
      <button className="back-link" onClick={() => navigate('/songs')}>
        &larr; Volver al listado
      </button>
      
      <div className="song-header">
        <h1>{song.title}</h1>
        <h3>{song.artist}</h3>
      </div>

      <div className="song-body">
        {song.lyricsUrl && (
          <div className="lyrics-section" style={{ marginTop: '48px' }}>
            <KaraokeDisplay url={song.lyricsUrl} currentTime={currentTime} />
          </div>
        )}
      </div>

      {song.audioUrl && (
        <div className="player-section" style={{ marginBottom: '32px' }}>
          <AudioConsole src={song.audioUrl} onTimeUpdate={setCurrentTime} />
        </div>
      )}
      
      <div className="song-details-grid">
        <div className="detail-item">
          <span className="label">Dificultad:</span>
          <span className={`value ${song.difficulty.toLowerCase()}`}>{song.difficulty}</span>
        </div>
        <div className="detail-item">
          <span className="label">Duración:</span>
          <span className="value">{song.duration}</span>
        </div>
      </div>
      
      <div className="song-actions" style={{ display: 'flex', gap: '16px' }}>

        <button 
          className="button secondary"
          onClick={() => navigate(`/songs/${id}/sync`)}
        >
          Modo Sincronización
        </button>
      </div>
    </div>
  );
};

export default SongDetailPage;
