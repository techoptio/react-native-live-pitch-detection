import NativeReactNativeLivePitchDetection from './NativeReactNativeLivePitchDetection';
import type { InitOptions } from './types';

const ReactNativeLivePitchDetection = {
  init: (options?: InitOptions) => {
    NativeReactNativeLivePitchDetection.init(
      options?.bufferSize ?? 4096,
      options?.minVolume ?? 0.0
    );
  },
  startListening: () => {
    NativeReactNativeLivePitchDetection.startListening();
  },
  stopListening: () => {
    NativeReactNativeLivePitchDetection.stopListening();
  },
  addListener: () => {
    NativeReactNativeLivePitchDetection.addListener();
  },
  isListening: () => {
    return NativeReactNativeLivePitchDetection.isListening();
  },
};

export default ReactNativeLivePitchDetection;
