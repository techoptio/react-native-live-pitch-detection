import type { NoteLetter, PitchEvent } from './types';

let A4 = 440;

const noteNames: NoteLetter[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export function setA4Frequency(frequency: number): void {
  A4 = frequency;
}

export function getA4Frequency(): number {
  return A4;
}

export function toPitchEvent(frequency: number): PitchEvent {
  if (frequency <= 0 || !isFinite(frequency)) {
    return {
      frequency: null,
      note: null,
      noteLetter: null,
      noteOctave: null,
    };
  }

  const midi = Math.round(12 * Math.log2(frequency / A4) + 69);
  const noteIndex = ((midi % 12) + 12) % 12;
  const noteOctave = Math.floor(midi / 12) - 1;
  const noteLetter = noteNames[noteIndex]!;

  return {
    frequency,
    note: `${noteLetter}${noteOctave}`,
    noteLetter,
    noteOctave,
  };
}
