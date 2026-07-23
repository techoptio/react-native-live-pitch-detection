type FrequencyListener = (event: { frequency: number }) => void;

const listeners = new Set<FrequencyListener>();
let listening = false;

const mockNative = {
  setOptions: jest.fn(),
  startListening: jest.fn(async () => {
    listening = true;
  }),
  stopListening: jest.fn(async () => {
    listening = false;
  }),
  isListening: jest.fn(() => listening),
  onFrequencyDetected: jest.fn((callback: FrequencyListener) => {
    listeners.add(callback);
    return {
      remove: () => {
        listeners.delete(callback);
      },
    };
  }),
  __emitFrequency: (frequency: number) => {
    for (const listener of listeners) {
      listener({ frequency });
    }
  },
  __reset: () => {
    listeners.clear();
    listening = false;
    mockNative.setOptions.mockClear();
    mockNative.startListening.mockClear();
    mockNative.stopListening.mockClear();
    mockNative.isListening.mockClear();
    mockNative.onFrequencyDetected.mockClear();
  },
};

export default mockNative;
