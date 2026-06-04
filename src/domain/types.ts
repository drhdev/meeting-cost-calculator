import type { GROUPS } from './constants';

export type GroupKey = keyof typeof GROUPS;

export type Participants = Record<GroupKey, number>;

export type CostStepEuro = 1 | 10 | 100 | 1000;

export type MoneyLocale = 'de-DE' | 'en-GB';

export const COST_STEP_OPTIONS: readonly CostStepEuro[] = [1, 10, 100, 1000] as const;

export function createEmptyParticipants(): Participants {
  return {
    tariff: 0,
    non_tariff: 0,
    executive: 0,
    board: 0,
  };
}

export function getTotalParticipantCount(participants: Participants): number {
  return (
    participants.tariff +
    participants.non_tariff +
    participants.executive +
    participants.board
  );
}
