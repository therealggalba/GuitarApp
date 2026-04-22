import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SONGS } from '../../utils/mockSongs';
import AudioConsole from '../../components/AudioPlayer/AudioConsole';
import './SyncTool.scss';

interface SyncLine {
  id: number;
  text: string;
  time: string; // "mm:ss.xx"
}

const SongSyncPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lines, setLines] = useState<SyncLine[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const song = MOCK_SONGS.find(s => s.id === id);

  useEffect(() => {
    const fetchOriginalLyrics = async () => {
      if (!song?.lyricsUrl) return;
      try {
        const response = await fetch(song.lyricsUrl);
        const text = await response.text();
        
        // Split by lines and clean timestamps if present, or just use text
        const rawLines = text.split('\n').filter(l => l.trim().length > 0);
        const parsedLines = rawLines.map((line, idx) => {
          const timeMatch = line.match(/\[(\d{2}:\d{2}[.:]\d{2})\]/);
          const cleanText = line.replace(/\[\d{2}:\d{2}[.:]\d{2}\]/, '').trim();
          return {
            id: idx,
            text: cleanText,
            time: timeMatch ? timeMatch[1] : '00:00.00'
          };
        });
        setLines(parsedLines);
      } catch (err) {
        console.error('Error fetching lyrics for sync:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOriginalLyrics();
  }, [song]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const insertCurrentTime = () => {
    if (selectedIndex === null) return;
    const newLines = [...lines];
    newLines[selectedIndex].time = formatTime(currentTime);
    setLines(newLines);
    
    // Auto-select next line
    if (selectedIndex < lines.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleExport = () => {
    const lrcContent = lines.map(line => `[${line.time}] ${line.text}`).join('\n');
    const element = document.createElement('a');
    const file = new Blob([lrcContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${song?.id || 'song'}_synced.txt`;
    document.body.appendChild(element);
    element.click();
    alert('Archivo generado. Por favor, sustitúyelo en la carpeta del proyecto.');
  };

  if (loading) return <div className="sync-status">Cargando herramienta de precisión...</div>;
  if (!song) return <div>Canción no encontrada</div>;

  return (
    <div className="sync-page">
      <div className="sync-header">
        <button className="back-btn" onClick={() => navigate(`/songs/${id}`)}>&larr; Cancelar</button>
        <h1>Sincronización: {song.title}</h1>
        <button className="save-btn" onClick={handleExport}>Guardar y Exportar</button>
      </div>

      <div className="sync-layout">
        <div className="player-pane">
          <AudioConsole src={song.audioUrl || ''} onTimeUpdate={setCurrentTime} />
          
          <div className="current-capture">
            <div className="time-label">TIEMPO ACTUAL (MS)</div>
            <div className="large-time">{formatTime(currentTime)}</div>
            <button 
              className="insert-btn" 
              disabled={selectedIndex === null}
              onClick={insertCurrentTime}
            >
              INSERTAR EN LÍNEA {selectedIndex !== null ? selectedIndex + 1 : '-'}
            </button>
          </div>
        </div>

        <div className="lyrics-pane">
          <div className="lyrics-list">
            {lines.map((line, index) => (
              <div 
                key={line.id} 
                className={`sync-row ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="line-num">{index + 1}</div>
                <div className="line-time">[{line.time}]</div>
                <div className="line-text">{line.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongSyncPage;
