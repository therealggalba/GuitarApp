export interface ChordDefinition {
  id: string;      // e.g. "REm"
  name: string;    // e.g. "REm"
  color: string;   // Hex color
}

export interface ChordEvent {
  startTime: number; // seconds
  chordId: string;   // Reference to ChordDefinition
}
