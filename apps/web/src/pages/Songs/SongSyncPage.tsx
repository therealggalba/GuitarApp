import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SONGS } from '../../utils/mockSongs';
import { CHORD_DICTIONARY } from '../../constants/chords';
import AudioConsole from '../../components/AudioPlayer/AudioConsole';
import './SyncTool.scss';

interface SyncLine {
  id: number;
  text: string;
  time: string; // "mm:ss.xx"
}

interface SyncChord {
  id: number;
  chordId: string;
  time: string;
}

const SongSyncPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lines, setLines] = useState<SyncLine[]>([]);
  const [syncedChords, setSyncedChords] = useState<SyncChord[]>([]);
  const [syncMode, setSyncMode] = useState<'lyrics' | 'chords'>('lyrics');
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const chordIdCounter = React.useRef(0);
  
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

  const insertChord = (chordId: string) => {
    const newChord: SyncChord = {
      id: chordIdCounter.current++,
      chordId,
      time: formatTime(currentTime)
    };
    setSyncedChords(prev => [...prev, newChord].sort((a,b) => a.time.localeCompare(b.time)));
  };

  const removeChord = (id: number) => {
    setSyncedChords(prev => prev.filter(c => c.id !== id));
  };

  const handleExport = () => {
    const lrcContent = lines.map(line => `[${line.time}] ${line.text}`).join('\n');
    const chordContent = syncedChords.map(c => `[${c.time}] ${c.chordId}`).join('\n');
    
    // Export combined or separate? User said "exportar creando un archivo nuevo"
    // I will generate two download links or one combined. Let's do two.
    downloadFile(lrcContent, 'lyrics_synced.txt');
    downloadFile(chordContent, 'chords_synced.txt');
    alert('Archivos generados. Por favor, sustitúyelos en la carpeta del proyecto.');
  };

  const downloadFile = (content: string, fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return <div className="sync-status">Cargando herramienta de precisión...</div>;
  if (!song) return <div>Canción no encontrada</div>;

  return (
    <div className="sync-page">
      <div className="sync-header">
        <button className="back-btn" onClick={() => navigate(`/songs/${id}`)}>&larr; Cancelar</button>
        <h1>Sincronización: {song.title}</h1>
        <div className="mode-selector">
          <button 
            className={`mode-btn ${syncMode === 'lyrics' ? 'active' : ''}`}
            onClick={() => setSyncMode('lyrics')}
          >
            Modo Letra
          </button>
          <button 
            className={`mode-btn ${syncMode === 'chords' ? 'active' : ''}`}
            onClick={() => setSyncMode('chords')}
          >
            Modo Acordes
          </button>
        </div>
        <button className="save-btn" onClick={handleExport}>Guardar y Exportar</button>
      </div>

      <div className="sync-layout">
        <div className="player-pane">
          <AudioConsole src={song.audioUrl || ''} onTimeUpdate={setCurrentTime} />
          
          <div className="current-capture">
            <div className="time-label">TIEMPO ACTUAL (MS)</div>
            <div className="large-time">{formatTime(currentTime)}</div>
            
            {syncMode === 'lyrics' ? (
              <button 
                className="insert-btn" 
                disabled={selectedIndex === null}
                onClick={insertCurrentTime}
              >
                INSERTAR EN LÍNEA {selectedIndex !== null ? selectedIndex + 1 : '-'}
              </button>
            ) : (
              <div className="chord-pad">
                <div className="pad-title">SELECTOR DE ACORDES</div>
                <div className="chord-grid">
                  {Object.keys(CHORD_DICTIONARY).map(cId => (
                    <button 
                      key={cId} 
                      className="chord-pad-btn" 
                      style={{ '--c-color': CHORD_DICTIONARY[cId].color } as React.CSSProperties}
                      onClick={() => insertChord(cId)}
                    >
                      {cId}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lyrics-pane">
          {syncMode === 'lyrics' ? (
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
          ) : (
            <div className="chords-list">
              <div className="list-title">ACORDES SINCRONIZADOS</div>
              {syncedChords.map(c => (
                <div key={c.id} className="chord-row">
                  <span className="c-time">[{c.time}]</span>
                  <span className="c-name" style={{ color: CHORD_DICTIONARY[c.chordId]?.color }}>{c.chordId}</span>
                  <button className="del-btn" onClick={() => removeChord(c.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongSyncPage;
