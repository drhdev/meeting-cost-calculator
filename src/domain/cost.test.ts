import { describe, it, expect } from 'vitest';
import { GROUPS } from './constants';
import {
  getCostPerSecond,
  getCostPerSecondForGroup,
  getElapsedCostEuro,
  getHoursPerWorkDay,
  getTotalRatePerSecond,
  getWorkDaysPerYear,
  getWorkSecondsPerYear,
  quantizeCostDisplay,
  formatDuration,
  formatEuro,
} from './cost';
import { createCustomPersona } from './customPersonas';
import type { CostStepEuro, GroupKey, Participants } from './types';
import { createEmptyParticipants } from './types';

const EXPECTED_WORK_DAYS = 220;
const EXPECTED_HOURS_PER_DAY = 7.6;
const EXPECTED_WORK_SECONDS = EXPECTED_WORK_DAYS * EXPECTED_HOURS_PER_DAY * 3600;

const GOLDEN_COST_PER_SECOND: Record<GroupKey, number> = {
  tariff: 0.0149,
  non_tariff: 0.0249,
  executive: 0.0498,
  board: 0.498,
};

describe('work time assumptions', () => {
  it('computes 220 work days per year', () => {
    expect(getWorkDaysPerYear()).toBe(EXPECTED_WORK_DAYS);
  });

  it('computes 7.6 hours per work day', () => {
    expect(getHoursPerWorkDay()).toBe(EXPECTED_HOURS_PER_DAY);
  });

  it('computes work seconds per year', () => {
    expect(getWorkSecondsPerYear()).toBe(EXPECTED_WORK_SECONDS);
  });
});

describe('getCostPerSecond', () => {
  it.each(Object.keys(GROUPS) as GroupKey[])(
    'matches golden rate for one %s participant',
    (group) => {
      const rate = getCostPerSecondForGroup(group);
      expect(rate).toBeCloseTo(GOLDEN_COST_PER_SECOND[group], 2);
      expect(rate).toBe(getCostPerSecond(GROUPS[group].annualSalary));
    },
  );

  it('returns 0 for zero salary', () => {
    expect(getCostPerSecond(0)).toBe(0);
  });

  it('rejects negative salary', () => {
    expect(() => getCostPerSecond(-1)).toThrow(RangeError);
  });
});

describe('getTotalRatePerSecond', () => {
  it('sums rates for multiple groups', () => {
    const participants: Participants = {
      tariff: 1,
      non_tariff: 0,
      executive: 0,
      board: 1,
    };
    const expected =
      getCostPerSecondForGroup('tariff') + getCostPerSecondForGroup('board');
    expect(getTotalRatePerSecond(participants)).toBeCloseTo(expected, 10);
  });

  it('returns 0 when nobody attends', () => {
    expect(
      getTotalRatePerSecond({
        tariff: 0,
        non_tariff: 0,
        executive: 0,
        board: 0,
      }),
    ).toBe(0);
  });

  it('rejects negative participant counts', () => {
    expect(() =>
      getTotalRatePerSecond({
        tariff: -1,
        non_tariff: 0,
        executive: 0,
        board: 0,
      }),
    ).toThrow(RangeError);
  });

  it('includes custom personas with their annual salary', () => {
    const devOps = createCustomPersona({
      label: 'DevOps',
      annualSalaryEuro: 60_000,
      count: 3,
    });
    const marketing = createCustomPersona({
      label: 'Marketing Experts',
      annualSalaryEuro: 75_000,
      count: 2,
    });
    const expected =
      3 * getCostPerSecond(60_000) + 2 * getCostPerSecond(75_000);
    expect(getTotalRatePerSecond(createEmptyParticipants(), [devOps, marketing])).toBeCloseTo(
      expected,
      10,
    );
  });
});

describe('getElapsedCostEuro', () => {
  it('scales linearly with elapsed time', () => {
    const rate = getCostPerSecondForGroup('tariff');
    expect(getElapsedCostEuro(10_000, rate)).toBeCloseTo(rate * 10, 10);
  });

  it('returns 0 for zero elapsed time', () => {
    expect(getElapsedCostEuro(0, 1)).toBe(0);
  });

  it('rejects negative inputs', () => {
    expect(() => getElapsedCostEuro(-1, 1)).toThrow(RangeError);
    expect(() => getElapsedCostEuro(0, -1)).toThrow(RangeError);
  });
});

describe('quantizeCostDisplay', () => {
  it('floors to step of 10', () => {
    expect(quantizeCostDisplay(47.3, 10)).toBe(40);
  });

  it('floors to step of 1000', () => {
    expect(quantizeCostDisplay(999.9, 1000)).toBe(0);
  });

  it('keeps exact multiples', () => {
    expect(quantizeCostDisplay(100, 100)).toBe(100);
  });

  it('supports 1 euro steps', () => {
    expect(quantizeCostDisplay(47.9, 1)).toBe(47);
  });

  it('rejects invalid inputs', () => {
    expect(() => quantizeCostDisplay(-1, 10)).toThrow(RangeError);
    expect(() => quantizeCostDisplay(10, 0 as CostStepEuro)).toThrow(RangeError);
  });
});

describe('formatDuration', () => {
  it('formats as HH:MM:SS', () => {
    expect(formatDuration(3_661_000)).toBe('01:01:01');
  });

  it('formats zero', () => {
    expect(formatDuration(0)).toBe('00:00:00');
  });

  it('rejects negative duration', () => {
    expect(() => formatDuration(-1)).toThrow(RangeError);
  });
});

describe('formatEuro', () => {
  it('formats for de-DE', () => {
    const formatted = formatEuro(1234.5, 'de-DE');
    expect(formatted).toContain('1');
    expect(formatted).toMatch(/€|EUR/);
  });

  it('formats for en-GB', () => {
    const formatted = formatEuro(1234.5, 'en-GB');
    expect(formatted).toContain('1');
    expect(formatted).toMatch(/€/);
  });
});
