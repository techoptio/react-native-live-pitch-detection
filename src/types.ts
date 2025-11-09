export type PitchEvent = {
    frequency: number;
};

export type InitOptions = {
    bufferSize?: number;
    minVolume?: number;
    updateIntervalMs?: number;
}