import { describe, it, expect } from 'vitest';
import { createEmptyParticipants, getTotalParticipantCount, COST_STEP_OPTIONS } from './types';

describe('participants helpers', () => {
  it('createEmptyParticipants returns zeros', () => {
    expect(createEmptyParticipants()).toEqual({
      tariff: 0,
      non_tariff: 0,
      executive: 0,
      board: 0,
    });
  });

  it('getTotalParticipantCount sums all groups', () => {
    expect(
      getTotalParticipantCount({
        tariff: 2,
        non_tariff: 1,
        executive: 0,
        board: 3,
      }),
    ).toBe(6);
  });
});

describe('COST_STEP_OPTIONS', () => {
  it('lists display step values', () => {
    expect(COST_STEP_OPTIONS).toEqual([1, 10, 100, 1000]);
  });
});
