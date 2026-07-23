import NativeReactNativeLivePitchDetection from './NativeReactNativeLivePitchDetection';
import type {
  NoteLetter,
  Options,
  PitchEvent,
  ReactNativeLivePitchDetectionEventCallback,
} from './types';

let A4 = 440; // A4 note frequency
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

const ReactNativeLivePitchDetection = {
  setOptions: (options: Options) => {
    A4 = options?.a4Frequency ?? 440;
    NativeReactNativeLivePitchDetection.setOptions(
      options?.bufferSize ?? 4096,
      options?.minVolume ?? -20.0,
      options?.updateIntervalMs ?? 100
    );
  },
  startListening: () => {
    return NativeReactNativeLivePitchDetection.startListening();
  },
  stopListening: () => {
    return NativeReactNativeLivePitchDetection.stopListening();
  },
  addListener: (callback: ReactNativeLivePitchDetectionEventCallback) => {
    return NativeReactNativeLivePitchDetection.onFrequencyDetected((event) => {
      callback(toPitchEvent(event.frequency));
    });
  },
  isListening: () => {
    return NativeReactNativeLivePitchDetection.isListening();
  },
};

function toPitchEvent(frequency: number): PitchEvent {
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

export default ReactNativeLivePitchDetection;

export * from './types';
