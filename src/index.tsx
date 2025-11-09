import NativeReactNativeLivePitchDetection from './NativeReactNativeLivePitchDetection';
import type { InitOptions } from './types';

const ReactNativeLivePitchDetection = {
  init: (options?: InitOptions) => {
    NativeReactNativeLivePitchDetection.init(
      options?.bufferSize ?? 4096,
      options?.minVolume ?? 0.0,
      options?.updateIntervalMs ?? -1
    );
  },
  startListening: () => {
    return NativeReactNativeLivePitchDetection.startListening();
  },
  stopListening: () => {
    return NativeReactNativeLivePitchDetection.stopListening();
  },
  addListener: () => {
    return NativeReactNativeLivePitchDetection.addListener();
  },
  isListening: () => {
    return NativeReactNativeLivePitchDetection.isListening();
  },
};

export default ReactNativeLivePitchDetection;
