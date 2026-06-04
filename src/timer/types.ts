import type { CustomPersona } from '../domain/customPersonas';
import type { CostStepEuro, Participants } from '../domain/types';

export type TimerPhase = 'setup' | 'running' | 'paused' | 'stopped_confirm' | 'ended';

export type AppLocale = 'de' | 'en';

export interface TimerSegment {
  startPerf: number;
  endPerf?: number;
}

export interface MeetingSession {
  phase: TimerPhase;
  segments: TimerSegment[];
  participants: Participants;
  customPersonas: CustomPersona[];
  costStepEuro: CostStepEuro;
  locale: AppLocale;
  finalElapsedMs?: number;
  finalCostEuro?: number;
}

export type SetupPatch = Partial<
  Pick<MeetingSession, 'participants' | 'customPersonas' | 'costStepEuro' | 'locale'>
>;
