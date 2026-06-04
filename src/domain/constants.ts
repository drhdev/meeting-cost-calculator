import { APP_CONFIG } from '../config/env';
import type { GroupKey } from './types';

export const WORK_TIME_ASSUMPTIONS = APP_CONFIG.workTime;

export const GROUPS: Record<GroupKey, { annualSalary: number; i18nKey: `group.${string}` }> = {
  tariff: { annualSalary: APP_CONFIG.salaries.tariff, i18nKey: 'group.tariff' },
  non_tariff: { annualSalary: APP_CONFIG.salaries.non_tariff, i18nKey: 'group.non_tariff' },
  executive: { annualSalary: APP_CONFIG.salaries.executive, i18nKey: 'group.executive' },
  board: { annualSalary: APP_CONFIG.salaries.board, i18nKey: 'group.board' },
};

export const GROUP_KEYS: GroupKey[] = ['tariff', 'non_tariff', 'executive', 'board'];
