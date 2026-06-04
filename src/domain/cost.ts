import { computeWorkDaysPerYear } from '../config/env';
import { GROUPS, WORK_TIME_ASSUMPTIONS } from './constants';
import type { CustomPersona } from './customPersonas';
import type { CostStepEuro, GroupKey, MoneyLocale, Participants } from './types';

export function getWorkDaysPerYear(): number {
  return computeWorkDaysPerYear(WORK_TIME_ASSUMPTIONS);
}

export function getHoursPerWorkDay(): number {
  return WORK_TIME_ASSUMPTIONS.hoursPerWeek / WORK_TIME_ASSUMPTIONS.workDaysPerWeek;
}

export function getWorkSecondsPerYear(): number {
  return getWorkDaysPerYear() * getHoursPerWorkDay() * 3600;
}

export function getCostPerSecond(annualSalary: number): number {
  if (annualSalary < 0) {
    throw new RangeError('annualSalary must be non-negative');
  }
  const workSeconds = getWorkSecondsPerYear();
  if (workSeconds <= 0) {
    throw new RangeError('workSecondsPerYear must be positive');
  }
  return annualSalary / workSeconds;
}

export function getCostPerSecondForGroup(group: GroupKey): number {
  return getCostPerSecond(GROUPS[group].annualSalary);
}

export function getTotalRatePerSecond(
  participants: Participants,
  customPersonas: CustomPersona[] = [],
): number {
  let total = 0;
  for (const group of Object.keys(GROUPS) as GroupKey[]) {
    const count = participants[group];
    if (count < 0) {
      throw new RangeError(`participant count for ${group} must be non-negative`);
    }
    total += count * getCostPerSecondForGroup(group);
  }
  for (const persona of customPersonas) {
    if (persona.count < 0) {
      throw new RangeError(`participant count for custom persona ${persona.id} must be non-negative`);
    }
    total += persona.count * getCostPerSecond(persona.annualSalaryEuro);
  }
  return total;
}

export function getElapsedCostEuro(elapsedMs: number, ratePerSecond: number): number {
  if (elapsedMs < 0) {
    throw new RangeError('elapsedMs must be non-negative');
  }
  if (ratePerSecond < 0) {
    throw new RangeError('ratePerSecond must be non-negative');
  }
  return (elapsedMs / 1000) * ratePerSecond;
}

export function quantizeCostDisplay(costEuro: number, stepEuro: CostStepEuro): number {
  if (costEuro < 0) {
    throw new RangeError('costEuro must be non-negative');
  }
  if (stepEuro <= 0) {
    throw new RangeError('stepEuro must be positive');
  }
  return Math.floor(costEuro / stepEuro) * stepEuro;
}

export function formatEuro(amount: number, locale: MoneyLocale): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDuration(ms: number): string {
  if (ms < 0) {
    throw new RangeError('ms must be non-negative');
  }
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}
