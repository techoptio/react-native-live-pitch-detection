import NativeReactNativeLivePitchDetection from './NativeReactNativeLivePitchDetection';
import { setA4Frequency, toPitchEvent } from './pitch';
import type {
  Options,
  ReactNativeLivePitchDetectionEventCallback,
} from './types';

const ReactNativeLivePitchDetection = {
  setOptions: (options: Options) => {
    setA4Frequency(options?.a4Frequency ?? 440);
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

export default ReactNativeLivePitchDetection;

export * from './types';
