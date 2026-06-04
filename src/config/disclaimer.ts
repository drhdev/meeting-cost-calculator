import { APP_CONFIG, computeWorkDaysPerYear } from './env';
import { moneyLocale } from '../i18n/localeConfig';
import type { AppLocale } from '../timer/types';

function formatConfigNumber(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(moneyLocale(locale), { maximumFractionDigits: 1 }).format(value);
}

export function getDisclaimerParams(locale: AppLocale): Record<string, string> {
  const { workTime } = APP_CONFIG;
  return {
    workDays: String(computeWorkDaysPerYear(workTime)),
    hoursPerWeek: formatConfigNumber(workTime.hoursPerWeek, locale),
    vacationDays: String(workTime.vacationDays),
    publicHolidays: String(workTime.publicHolidays),
  };
}
