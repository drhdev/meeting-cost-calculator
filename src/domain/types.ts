import type { CustomPersona } from './customPersonas';

export type GroupKey = 'tariff' | 'non_tariff' | 'executive' | 'board';

export type Participants = Record<GroupKey, number>;

export type CostStepEuro = 1 | 10 | 100 | 1000;

export type MoneyLocale = string;

export const COST_STEP_OPTIONS: readonly CostStepEuro[] = [1, 10, 100, 1000] as const;

export function createEmptyParticipants(): Participants {
  return {
    tariff: 0,
    non_tariff: 0,
    executive: 0,
    board: 0,
  };
}

export function getStandardParticipantCount(participants: Participants): number {
  return (
    participants.tariff +
    participants.non_tariff +
    participants.executive +
    participants.board
  );
}

export function getTotalParticipantCount(
  participants: Participants,
  customPersonas: CustomPersona[] = [],
): number {
  return (
    getStandardParticipantCount(participants) +
    customPersonas.reduce((sum, persona) => sum + persona.count, 0)
  );
}
