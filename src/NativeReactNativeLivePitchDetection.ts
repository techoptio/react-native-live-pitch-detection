import { TurboModuleRegistry, type TurboModule, type CodegenTypes } from 'react-native';

export interface Spec extends TurboModule {
  setOptions(bufferSize: number, minVolume: number, updateIntervalMs: number): void;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  isListening(): boolean;
  readonly onFrequencyDetected: CodegenTypes.EventEmitter<{ frequency: number }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeLivePitchDetection');