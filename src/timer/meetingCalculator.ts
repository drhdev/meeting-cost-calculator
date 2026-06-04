import {
  getElapsedCostEuro,
  getTotalRatePerSecond,
  quantizeCostDisplay,
} from '../domain/cost';
import { createEmptyParticipants } from '../domain/types';
import type { MeetingSession, SetupPatch, TimerSegment } from './types';

export function createInitialSession(): MeetingSession {
  return {
    phase: 'setup',
    segments: [],
    participants: createEmptyParticipants(),
    customPersonas: [],
    costStepEuro: 10,
    locale: 'de',
  };
}

function closeOpenSegment(segments: TimerSegment[], endPerf: number): TimerSegment[] {
  if (segments.length === 0) {
    return segments;
  }
  const last = segments[segments.length - 1];
  if (last === undefined || last.endPerf !== undefined) {
    return segments;
  }
  return [...segments.slice(0, -1), { ...last, endPerf }];
}

export function getElapsedMs(session: MeetingSession, nowPerf: number): number {
  if (session.phase === 'ended' && session.finalElapsedMs !== undefined) {
    return session.finalElapsedMs;
  }

  let total = 0;
  for (const segment of session.segments) {
    if (segment.endPerf !== undefined) {
      total += segment.endPerf - segment.startPerf;
    } else if (session.phase === 'running') {
      total += nowPerf - segment.startPerf;
    }
  }
  return Math.max(0, total);
}

export function getSessionRatePerSecond(session: MeetingSession): number {
  return getTotalRatePerSecond(session.participants, session.customPersonas);
}

export function getSessionElapsedCostEuro(session: MeetingSession, nowPerf: number): number {
  return getElapsedCostEuro(getElapsedMs(session, nowPerf), getSessionRatePerSecond(session));
}

export function getSessionDisplayedCostEuro(session: MeetingSession, nowPerf: number): number {
  return quantizeCostDisplay(
    getSessionElapsedCostEuro(session, nowPerf),
    session.costStepEuro,
  );
}

export function patchSetup(session: MeetingSession, patch: SetupPatch): MeetingSession {
  if (session.phase !== 'setup') {
    return session;
  }
  return { ...session, ...patch };
}

export function start(session: MeetingSession, nowPerf: number): MeetingSession {
  if (session.phase === 'paused') {
    return resume(session, nowPerf);
  }
  if (session.phase !== 'setup' && session.phase !== 'stopped_confirm') {
    return session;
  }

  return {
    ...session,
    phase: 'running',
    segments: [...session.segments, { startPerf: nowPerf }],
    finalElapsedMs: undefined,
    finalCostEuro: undefined,
  };
}

export function pause(session: MeetingSession, nowPerf: number): MeetingSession {
  if (session.phase !== 'running') {
    return session;
  }

  return {
    ...session,
    phase: 'paused',
    segments: closeOpenSegment(session.segments, nowPerf),
  };
}

export function resume(session: MeetingSession, nowPerf: number): MeetingSession {
  if (session.phase !== 'paused') {
    return session;
  }

  return {
    ...session,
    phase: 'running',
    segments: [...session.segments, { startPerf: nowPerf }],
  };
}

export function stopOnce(session: MeetingSession, nowPerf: number): MeetingSession {
  if (session.phase !== 'running' && session.phase !== 'paused') {
    return session;
  }

  const segments =
    session.phase === 'running'
      ? closeOpenSegment(session.segments, nowPerf)
      : session.segments;

  return {
    ...session,
    phase: 'stopped_confirm',
    segments,
  };
}

export function stopConfirm(session: MeetingSession, nowPerf: number): MeetingSession {
  if (session.phase !== 'stopped_confirm') {
    return session;
  }

  const finalElapsedMs = getElapsedMs(session, nowPerf);
  const rate = getSessionRatePerSecond(session);
  const finalCostEuro = getElapsedCostEuro(finalElapsedMs, rate);

  return {
    ...session,
    phase: 'ended',
    finalElapsedMs,
    finalCostEuro,
  };
}

export function reset(session: MeetingSession): MeetingSession {
  return {
    ...session,
    phase: 'setup',
    segments: [],
    finalElapsedMs: undefined,
    finalCostEuro: undefined,
  };
}

export function stop(session: MeetingSession, nowPerf: number): MeetingSession {
  if (session.phase === 'running' || session.phase === 'paused') {
    return stopOnce(session, nowPerf);
  }
  if (session.phase === 'stopped_confirm') {
    return stopConfirm(session, nowPerf);
  }
  return session;
}
