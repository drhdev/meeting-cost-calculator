import { describe, expect, it } from 'vitest';
import { isDistractionFreePhase } from './phase';

describe('isDistractionFreePhase', () => {
  it('is true while a meeting is active', () => {
    expect(isDistractionFreePhase('running')).toBe(true);
    expect(isDistractionFreePhase('paused')).toBe(true);
    expect(isDistractionFreePhase('stopped_confirm')).toBe(true);
  });

  it('is false before start and after end', () => {
    expect(isDistractionFreePhase('setup')).toBe(false);
    expect(isDistractionFreePhase('ended')).toBe(false);
  });
});
