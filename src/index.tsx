import NativeReactNativeLivePitchDetection from './NativeReactNativeLivePitchDetection';
import type {
  Options,
  ReactNativeLivePitchDetectionEventCallback,
} from './types';

let A4 = 440; // A4 note frequency
const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
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
      callback({
        frequency: event.frequency,
        note: getNoteFromFrequency(event.frequency),
      });
    });
  },
  isListening: () => {
    return NativeReactNativeLivePitchDetection.isListening();
  },
};

function getNoteFromFrequency(frequency: number): string {
  if (frequency <= 0 || !isFinite(frequency)) return "-";

  const noteNumber = 12 * Math.log2(frequency / A4) + 69;
  const noteIndex = Math.round(noteNumber) % 12;
  const octave = Math.floor(Math.round(noteNumber) / 12) - 1;

  return `${noteNames[noteIndex]}${octave}`;
};


export default ReactNativeLivePitchDetection;

export * from './types';
