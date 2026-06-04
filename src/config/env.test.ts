import { describe, it, expect } from 'vitest';
import { computeWorkDaysPerYear } from './env';

describe('computeWorkDaysPerYear', () => {
  it('computes 220 days from default components', () => {
    expect(
      computeWorkDaysPerYear({
        daysPerYear: 365,
        weekendDays: 104,
        vacationDays: 30,
        publicHolidays: 11,
        hoursPerWeek: 38,
        workDaysPerWeek: 5,
      }),
    ).toBe(220);
  });

  it('uses override when set', () => {
    expect(
      computeWorkDaysPerYear({
        daysPerYear: 365,
        weekendDays: 104,
        vacationDays: 30,
        publicHolidays: 11,
        hoursPerWeek: 38,
        workDaysPerWeek: 5,
        workDaysOverride: 200,
      }),
    ).toBe(200);
  });
});
