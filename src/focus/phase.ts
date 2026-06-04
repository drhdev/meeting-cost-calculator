import type { TimerPhase } from '../timer/types';

export function isDistractionFreePhase(phase: TimerPhase): boolean {
  return phase === 'running' || phase === 'paused' || phase === 'stopped_confirm';
}
