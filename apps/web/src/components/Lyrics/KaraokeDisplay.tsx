import React, { useState, useEffect, useMemo } from 'react';
import type { KaraokeLine } from '@guitar-app/domain';
import { parseLRC } from '../../utils/lyricsParser';
import './KaraokeDisplay.scss';

interface KaraokeDisplayProps {
  url: string;
  currentTime: number;
}

const KaraokeDisplay: React.FC<KaraokeDisplayProps> = ({ url, currentTime }) => {
  const [lines, setLines] = useState<KaraokeLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        setLines(parseLRC(text));
      } catch (err) {
        console.error('Error loading karaoke lyrics:', err);
      } finally {
        setLoading(false);
      }
    };
    if (url) fetchLyrics();
  }, [url]);

  const activeIndex = useMemo(() => {
    // Find the last line whose startTime is less than or equal to current time
    let index = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startTime <= currentTime) {
            index = i;
        } else {
            break;
        }
    }
    return index;
  }, [lines, currentTime]);

  if (loading) return <div className="karaoke-status">Preparando Karaoke...</div>;
  if (lines.length === 0) return <div className="karaoke-status">No hay datos de sincronización</div>;

  const prevLine = activeIndex > 0 ? lines[activeIndex - 1] : null;
  const currentLine = activeIndex >= 0 ? lines[activeIndex] : { text: '...', startTime: 0 };
  const nextLine = activeIndex < lines.length - 1 ? lines[activeIndex + 1] : null;

  return (
    <div className="karaoke-container">
      <div className="karaoke-viewport">
        <div className="line previous">
          {prevLine ? prevLine.text : ''}
        </div>
        <div className="line active">
          {currentLine.text}
        </div>
        <div className="line next">
          {nextLine ? nextLine.text : ''}
        </div>
      </div>
    </div>
  );
};

export default KaraokeDisplay;
