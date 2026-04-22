import type { ChordDefinition } from '@guitar-app/domain';

export const CHORD_DICTIONARY: Record<string, ChordDefinition> = {
  'LAm': { id: 'LAm', name: 'LAm', color: '#ff4d00' }, // Orange
  'REm': { id: 'REm', name: 'REm', color: '#ffeb3b' }, // Yellow
  'MIm': { id: 'MIm', name: 'MIm', color: '#4caf50' }, // Green
  'DO':  { id: 'DO',  name: 'DO',  color: '#2196f3' }, // Blue
  'SOL': { id: 'SOL', name: 'SOL', color: '#e91e63' }, // Pink
  'FA':  { id: 'FA',  name: 'FA',  color: '#9c27b0' }, // Purple
  'SI7': { id: 'SI7', name: 'SI7', color: '#00e5ff' }, // Cyan
};

export const getChordById = (id: string): ChordDefinition => {
  return CHORD_DICTIONARY[id] || { id, name: id, color: '#ffffff' };
};
