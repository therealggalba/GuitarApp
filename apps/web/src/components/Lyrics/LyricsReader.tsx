import React, { useState, useEffect } from 'react';
import './LyricsReader.scss';

interface LyricsReaderProps {
  url: string;
}

const LyricsReader: React.FC<LyricsReaderProps> = ({ url }) => {
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Archivo de letra no encontrado');
        const text = await response.text();
        setLyrics(text);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchLyrics();
  }, [url]);

  if (loading) return <div className="lyrics-status">Cargando letra...</div>;
  if (error) return <div className="lyrics-status error">Error: {error}</div>;

  return (
    <div className="lyrics-reader">
      <div className="lyrics-header">LETRA</div>
      <pre className="lyrics-content">{lyrics}</pre>
    </div>
  );
};

export default LyricsReader;
