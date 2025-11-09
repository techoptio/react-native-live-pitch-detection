export type PitchEvent = {
    frequency: number;
    note: string;
};

export type ReactNativeLivePitchDetectionEventCallback = (event: PitchEvent) => void;

export type Options = {
    bufferSize?: number;
    minVolume?: number;
    updateIntervalMs?: number;
    a4Frequency?: number;
}