import type { ChordEvent } from '@guitar-app/domain';

/**
 * Parses a Chords file in LRC-style timestamps.
 * Format: [mm:ss.xx] CHORD_NAME
 */
export const parseChords = (content: string): ChordEvent[] => {
  const lines = content.split('\n');
  const chordEvents: ChordEvent[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})[.:](\d{2})\]/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      
      const startTime = minutes * 60 + seconds + milliseconds / 100;
      const chordId = line.replace(timeRegex, '').trim();
      
      if (chordId) {
        chordEvents.push({ startTime, chordId });
      }
    }
  }

  return chordEvents.sort((a, b) => a.startTime - b.startTime);
};
