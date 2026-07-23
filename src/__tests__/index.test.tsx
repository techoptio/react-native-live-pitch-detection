import mockNative from '../__mocks__/NativeReactNativeLivePitchDetection';
import { getA4Frequency, setA4Frequency } from '../pitch';

jest.mock('../NativeReactNativeLivePitchDetection', () =>
  require('../__mocks__/NativeReactNativeLivePitchDetection')
);

import ReactNativeLivePitchDetection from '../index';

describe('ReactNativeLivePitchDetection', () => {
  beforeEach(() => {
    mockNative.__reset();
    setA4Frequency(440);
  });

  describe('setOptions', () => {
    it('forwards default bufferSize, minVolume, and updateIntervalMs', () => {
      ReactNativeLivePitchDetection.setOptions({});

      expect(mockNative.setOptions).toHaveBeenCalledWith(4096, -20.0, 100);
      expect(getA4Frequency()).toBe(440);
    });

    it('forwards custom options and updates A4', () => {
      ReactNativeLivePitchDetection.setOptions({
        bufferSize: 2048,
        minVolume: -30,
        updateIntervalMs: 50,
        a4Frequency: 442,
      });

      expect(mockNative.setOptions).toHaveBeenCalledWith(2048, -30, 50);
      expect(getA4Frequency()).toBe(442);
    });
  });

  describe('listening controls', () => {
    it('delegates startListening, stopListening, and isListening', async () => {
      expect(ReactNativeLivePitchDetection.isListening()).toBe(false);

      await ReactNativeLivePitchDetection.startListening();
      expect(mockNative.startListening).toHaveBeenCalled();
      expect(ReactNativeLivePitchDetection.isListening()).toBe(true);

      await ReactNativeLivePitchDetection.stopListening();
      expect(mockNative.stopListening).toHaveBeenCalled();
      expect(ReactNativeLivePitchDetection.isListening()).toBe(false);
    });
  });

  describe('addListener', () => {
    it('maps native frequency events to PitchEvent', () => {
      const callback = jest.fn();
      ReactNativeLivePitchDetection.addListener(callback);

      mockNative.__emitFrequency(440);

      expect(callback).toHaveBeenCalledWith({
        frequency: 440,
        note: 'A4',
        noteLetter: 'A',
        noteOctave: 4,
      });
    });

    it('maps quiet / invalid native frequencies to null fields', () => {
      const callback = jest.fn();
      ReactNativeLivePitchDetection.addListener(callback);

      mockNative.__emitFrequency(-1);

      expect(callback).toHaveBeenCalledWith({
        frequency: null,
        note: null,
        noteLetter: null,
        noteOctave: null,
      });
    });

    it('uses A4 from setOptions for subsequent pitch events', () => {
      const callback = jest.fn();
      ReactNativeLivePitchDetection.setOptions({ a4Frequency: 442 });
      ReactNativeLivePitchDetection.addListener(callback);

      mockNative.__emitFrequency(442);

      expect(callback).toHaveBeenCalledWith({
        frequency: 442,
        note: 'A4',
        noteLetter: 'A',
        noteOctave: 4,
      });
    });

    it('stops delivering events after remove()', () => {
      const callback = jest.fn();
      const subscription = ReactNativeLivePitchDetection.addListener(callback);

      mockNative.__emitFrequency(440);
      expect(callback).toHaveBeenCalledTimes(1);

      subscription.remove();
      mockNative.__emitFrequency(880);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
