import NativeReactNativeLivePitchDetection from './NativeReactNativeLivePitchDetection';
import type {
  Options,
  ReactNativeLivePitchDetectionEventCallback,
} from './types';

const ReactNativeLivePitchDetection = {
  setOptions: (options: Options) => {
    NativeReactNativeLivePitchDetection.setOptions(
      options?.bufferSize ?? 4096,
      options?.minVolume ?? 0.0,
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
    return NativeReactNativeLivePitchDetection.onFrequencyDetected(callback);
  },
  isListening: () => {
    return NativeReactNativeLivePitchDetection.isListening();
  },
};

export default ReactNativeLivePitchDetection;

export * from './types';
