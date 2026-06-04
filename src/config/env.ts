const DEFAULTS = {
  tipsUrl: 'https://example.com/meeting-tips',
  workTime: {
    daysPerYear: 365,
    weekendDays: 104,
    vacationDays: 30,
    publicHolidays: 11,
    hoursPerWeek: 38,
    workDaysPerWeek: 5,
    workDaysOverride: undefined as number | undefined,
  },
  salaries: {
    tariff: 90_000,
    non_tariff: 150_000,
    executive: 300_000,
    board: 3_000_000,
  },
} as const;

export type WorkTimeConfig = {
  daysPerYear: number;
  weekendDays: number;
  vacationDays: number;
  publicHolidays: number;
  hoursPerWeek: number;
  workDaysPerWeek: number;
  workDaysOverride?: number;
};

export type StandardSalaries = {
  tariff: number;
  non_tariff: number;
  executive: number;
  board: number;
};

export type AppConfig = {
  tipsUrl: string;
  workTime: WorkTimeConfig;
  salaries: StandardSalaries;
};

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

function parseOptionalPositiveInt(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }
  return Math.floor(parsed);
}

function parsePositiveNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

export function computeWorkDaysPerYear(workTime: WorkTimeConfig): number {
  if (workTime.workDaysOverride !== undefined) {
    return workTime.workDaysOverride;
  }
  return (
    workTime.daysPerYear -
    workTime.weekendDays -
    workTime.vacationDays -
    workTime.publicHolidays
  );
}

export function loadAppConfig(): AppConfig {
  const env = import.meta.env;

  const workTime: WorkTimeConfig = {
    daysPerYear: parsePositiveInt(env.VITE_DAYS_PER_YEAR, DEFAULTS.workTime.daysPerYear),
    weekendDays: parsePositiveInt(env.VITE_WEEKEND_DAYS, DEFAULTS.workTime.weekendDays),
    vacationDays: parsePositiveInt(env.VITE_VACATION_DAYS, DEFAULTS.workTime.vacationDays),
    publicHolidays: parsePositiveInt(
      env.VITE_PUBLIC_HOLIDAYS,
      DEFAULTS.workTime.publicHolidays,
    ),
    hoursPerWeek: parsePositiveNumber(
      env.VITE_HOURS_PER_WEEK,
      DEFAULTS.workTime.hoursPerWeek,
    ),
    workDaysPerWeek: parsePositiveInt(
      env.VITE_WORK_DAYS_PER_WEEK,
      DEFAULTS.workTime.workDaysPerWeek,
    ),
    workDaysOverride: parseOptionalPositiveInt(env.VITE_WORK_DAYS_PER_YEAR),
  };

  return {
    tipsUrl: env.VITE_TIPS_URL?.trim() || DEFAULTS.tipsUrl,
    workTime,
    salaries: {
      tariff: parsePositiveInt(env.VITE_SALARY_TARIFF, DEFAULTS.salaries.tariff),
      non_tariff: parsePositiveInt(env.VITE_SALARY_NON_TARIFF, DEFAULTS.salaries.non_tariff),
      executive: parsePositiveInt(env.VITE_SALARY_EXECUTIVE, DEFAULTS.salaries.executive),
      board: parsePositiveInt(env.VITE_SALARY_BOARD, DEFAULTS.salaries.board),
    },
  };
}

/** Resolved once at module load (Vite embeds `import.meta.env` at build time). */
export const APP_CONFIG: AppConfig = loadAppConfig();

export const WORK_DAYS_PER_YEAR = computeWorkDaysPerYear(APP_CONFIG.workTime);
