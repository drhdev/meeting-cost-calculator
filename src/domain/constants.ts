export const GROUPS = {
  tariff: { annualSalary: 90_000, i18nKey: 'group.tariff' },
  non_tariff: { annualSalary: 150_000, i18nKey: 'group.non_tariff' },
  executive: { annualSalary: 300_000, i18nKey: 'group.executive' },
  board: { annualSalary: 3_000_000, i18nKey: 'group.board' },
} as const;

export const WORK_TIME_ASSUMPTIONS = {
  daysPerYear: 365,
  weekendDays: 104,
  vacationDays: 30,
  sickDays: 5,
  publicHolidays: 10,
  hoursPerWeek: 38,
  workDaysPerWeek: 5,
} as const;

export const GROUP_KEYS = Object.keys(GROUPS) as (keyof typeof GROUPS)[];
