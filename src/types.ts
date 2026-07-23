export type NoteLetter =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

export type PitchEvent = {
  frequency: number | null;
  note: string | null;
  noteLetter: NoteLetter | null;
  noteOctave: number | null;
};

export type ReactNativeLivePitchDetectionEventCallback = (
  event: PitchEvent
) => void;

export type Options = {
  bufferSize?: number;
  minVolume?: number;
  updateIntervalMs?: number;
  a4Frequency?: number;
};
