import React, { useState, useEffect, useMemo } from 'react';
import type { KaraokeLine, ChordEvent } from '@guitar-app/domain';
import { parseLRC } from '../../utils/lyricsParser';
import { parseChords } from '../../utils/chordParser';
import { getChordById } from '../../constants/chords';
import ChordSymbol from '../Chords/ChordSymbol';
import './KaraokeDisplay.scss';

interface KaraokeDisplayProps {
  url: string;
  chordsUrl?: string;
  currentTime: number;
}

const KaraokeDisplay: React.FC<KaraokeDisplayProps> = ({ url, chordsUrl, currentTime }) => {
  const [lines, setLines] = useState<KaraokeLine[]>([]);
  const [chords, setChords] = useState<ChordEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const lyricRes = await fetch(url);
        const lyricTxt = await lyricRes.text();
        setLines(parseLRC(lyricTxt));

        if (chordsUrl) {
          const chordRes = await fetch(chordsUrl);
          if (chordRes.ok) {
            const chordTxt = await chordRes.text();
            setChords(parseChords(chordTxt));
          }
        }
      } catch (err) {
        console.error('Error loading karaoke resources:', err);
      } finally {
        setLoading(false);
      }
    };
    if (url) fetchLyrics();
  }, [url, chordsUrl]);

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

  // Find chords belonging to the active line + surrounding buffer
  const activeLineStart = currentLine.startTime;
  const activeLineEnd = nextLine ? nextLine.startTime : Infinity;

  const currentChords = chords.filter(c => 
    c.startTime >= activeLineStart && c.startTime < activeLineEnd
  );

  return (
    <div className="karaoke-container">
      <div className="karaoke-viewport">
        <div className="line previous">
          {prevLine ? prevLine.text : ''}
        </div>
        
        <div className="line active">
          <div className="chord-layer">
            {currentChords.map((ev, idx) => {
              const chordDef = getChordById(ev.chordId);
              // Simple calculation for horizontal position based on time within line
              const lineDuration = activeLineEnd - activeLineStart;
              const relativePos = ((ev.startTime - activeLineStart) / lineDuration) * 80 + 10; 
              
              return (
                <div 
                  key={`${ev.chordId}-${idx}`} 
                  className="chord-wrapper"
                  style={{ left: `${relativePos}%` }}
                >
                  <ChordSymbol 
                    name={chordDef.name} 
                    color={chordDef.color}
                    active={currentTime >= ev.startTime && currentTime < ev.startTime + 2} 
                  />
                </div>
              );
            })}
          </div>
          <div className="lyric-text">{currentLine.text}</div>
        </div>

        <div className="line next">
          {nextLine ? nextLine.text : ''}
        </div>
      </div>
    </div>
  );
};

export default KaraokeDisplay;
