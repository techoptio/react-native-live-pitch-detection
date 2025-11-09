import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  init(bufferSize: number, minVolume: number): void;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  addListener(): void;
  isListening(): boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeLivePitchDetection');