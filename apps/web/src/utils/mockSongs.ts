import type { Song } from '@guitar-app/domain';

export const MOCK_SONGS: Song[] = [
  {
    id: 'duende-garrapata',
    title: 'Duende Garrapata',
    artist: 'Los Delinqüentes',
    difficulty: 'Medium',
    duration: '4:20',
    description: 'Un clásico del rumbatón garrapatero.',
    audioUrl: '/songs/duende-garrapata/audio.mp3',
    lyricsUrl: '/songs/duende-garrapata/lyrics.txt'
  },
  {
    id: '1',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    difficulty: 'Hard',
    duration: '8:02',
    description: 'A classic rock masterpiece with an iconic solo.'
  },
  {
    id: '2',
    title: 'Wonderwall',
    artist: 'Oasis',
    difficulty: 'Easy',
    duration: '4:18',
    description: 'The ultimate campfire song.'
  },
  {
    id: '3',
    title: 'Sultans of Swing',
    artist: 'Dire Straits',
    difficulty: 'Expert',
    duration: '5:48',
    description: 'Complex clean guitar work by Mark Knopfler.'
  },
  {
    id: '4',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    difficulty: 'Medium',
    duration: '5:01',
    description: 'The anthem of a generation.'
  }
];
