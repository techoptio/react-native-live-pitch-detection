import {
  getA4Frequency,
  setA4Frequency,
  toPitchEvent,
} from '../pitch';

describe('toPitchEvent', () => {
  beforeEach(() => {
    setA4Frequency(440);
  });

  it('maps 440 Hz to A4 when A4 is 440', () => {
    expect(toPitchEvent(440)).toEqual({
      frequency: 440,
      note: 'A4',
      noteLetter: 'A',
      noteOctave: 4,
    });
  });

  it('maps C4 (~261.63 Hz)', () => {
    expect(toPitchEvent(261.63)).toEqual({
      frequency: 261.63,
      note: 'C4',
      noteLetter: 'C',
      noteOctave: 4,
    });
  });

  it('maps 880 Hz to A5', () => {
    expect(toPitchEvent(880)).toEqual({
      frequency: 880,
      note: 'A5',
      noteLetter: 'A',
      noteOctave: 5,
    });
  });

  it.each([0, -1, NaN, Infinity, -Infinity])(
    'returns null fields for invalid frequency %p',
    (frequency) => {
      expect(toPitchEvent(frequency)).toEqual({
        frequency: null,
        note: null,
        noteLetter: null,
        noteOctave: null,
      });
    }
  );

  it('uses custom A4 frequency for note mapping', () => {
    setA4Frequency(442);
    expect(getA4Frequency()).toBe(442);
    expect(toPitchEvent(442)).toEqual({
      frequency: 442,
      note: 'A4',
      noteLetter: 'A',
      noteOctave: 4,
    });
  });

  it('wraps negative MIDI note indices to a valid note letter', () => {
    // Very low frequency produces a negative MIDI number; noteIndex must stay in 0–11.
    const event = toPitchEvent(1);
    expect(event.frequency).toBe(1);
    expect(event.noteLetter).toMatch(/^(C|C#|D|D#|E|F|F#|G|G#|A|A#|B)$/);
    expect(event.note).toBe(`${event.noteLetter}${event.noteOctave}`);
    expect(typeof event.noteOctave).toBe('number');
  });
});
