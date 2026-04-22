import type { KaraokeLine } from '@guitar-app/domain';

/**
 * Parses an LRC-style string into an array of KaraokeLine.
 * Format: [mm:ss.xx] lyric text
 */
export const parseLRC = (lrcContent: string): KaraokeLine[] => {
  const lines = lrcContent.split('\n');
  const karaokeLines: KaraokeLine[] = [];
  
  // Regex to match [mm:ss.xx] or [mm:ss:xx]
  const timeRegex = /\[(\d{2}):(\d{2})[.:](\d{2})\]/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      
      const startTime = minutes * 60 + seconds + milliseconds / 100;
      const text = line.replace(timeRegex, '').trim();
      
      if (text) {
        karaokeLines.push({ startTime, text });
      }
    }
  }

  // Ensure lines are sorted by time
  return karaokeLines.sort((a, b) => a.startTime - b.startTime);
};
