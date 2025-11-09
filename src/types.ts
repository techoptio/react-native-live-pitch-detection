export type PitchEvent = {
    frequency: number;
};

export type ReactNativeLivePitchDetectionEventCallback = (event: PitchEvent) => void;

export type Options = {
    bufferSize?: number;
    minVolume?: number;
    updateIntervalMs?: number;
}