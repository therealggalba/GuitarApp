export type SongDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: SongDifficulty;
  duration?: string; // e.g. "3:45"
  description?: string;
  thumbnailUrl?: string;
  audioUrl?: string;   // Path to mp3
  lyricsUrl?: string;  // Path to txt
}
