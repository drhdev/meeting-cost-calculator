import { describe, it, expect } from 'vitest';
import { APP_CONFIG, computeWorkDaysPerYear } from './env';
import { getDisclaimerParams } from './disclaimer';

describe('getDisclaimerParams', () => {
  it('matches loaded app config work time', () => {
    const params = getDisclaimerParams('de');
    expect(params.workDays).toBe(String(computeWorkDaysPerYear(APP_CONFIG.workTime)));
    expect(params.vacationDays).toBe(String(APP_CONFIG.workTime.vacationDays));
    expect(params.publicHolidays).toBe(String(APP_CONFIG.workTime.publicHolidays));
    expect(params.hoursPerWeek).toContain('38');
  });
});
