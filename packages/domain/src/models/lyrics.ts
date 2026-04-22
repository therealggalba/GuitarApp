export interface KaraokeLine {
  startTime: number; // in seconds
  text: string;
}

export interface SynchronizedLyrics {
  lines: KaraokeLine[];
}
