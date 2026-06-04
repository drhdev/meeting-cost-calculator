import { describe, it, expect } from 'vitest';
import { createEmptyParticipants } from '../domain/types';
import { getCostPerSecondForGroup } from '../domain/cost';
import {
  createInitialSession,
  getElapsedMs,
  pause,
  reset,
  resume,
  start,
  stop,
  stopConfirm,
  stopOnce,
} from './meetingTimer';

function sessionWithOneTariff() {
  return {
    ...createInitialSession(),
    participants: { ...createEmptyParticipants(), tariff: 1 },
  };
}

describe('createInitialSession', () => {
  it('starts in setup with empty segments', () => {
    const session = createInitialSession();
    expect(session.phase).toBe('setup');
    expect(session.segments).toEqual([]);
    expect(session.costStepEuro).toBe(10);
    expect(session.locale).toBe('de');
  });
});

describe('elapsed time', () => {
  it('accumulates 20s across pause gap', () => {
    let session = sessionWithOneTariff();
    session = start(session, 1000);
    session = pause(session, 11_000);
    expect(getElapsedMs(session, 20_000)).toBe(10_000);

    session = resume(session, 25_000);
    session = pause(session, 35_000);
    expect(getElapsedMs(session, 40_000)).toBe(20_000);
  });

  it('does not increase elapsed while paused', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    session = pause(session, 5000);
    expect(getElapsedMs(session, 60_000)).toBe(5000);
  });

  it('stays within 100ms drift over 5 simulated minutes', () => {
    let session = sessionWithOneTariff();
    const t0 = 100_000;
    session = start(session, t0);
    const endPerf = t0 + 300_000;
    session = pause(session, endPerf);
    const elapsed = getElapsedMs(session, endPerf + 50_000);
    expect(Math.abs(elapsed - 300_000)).toBeLessThanOrEqual(100);
  });
});

describe('stop flow', () => {
  it('freezes elapsed on first stop', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    session = stopOnce(session, 8000);
    expect(session.phase).toBe('stopped_confirm');
    expect(getElapsedMs(session, 120_000)).toBe(8000);
  });

  it('sets finals on stop confirm', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    session = stopOnce(session, 12_000);
    session = stopConfirm(session, 12_000);
    expect(session.phase).toBe('ended');
    expect(session.finalElapsedMs).toBe(12_000);
    const rate = getCostPerSecondForGroup('tariff');
    expect(session.finalCostEuro).toBeCloseTo((12_000 / 1000) * rate, 10);
    expect(getElapsedMs(session, 999_000)).toBe(12_000);
  });

  it('final cost matches elapsed cost at confirm within 0.01 euro', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    const atStop = 15_000;
    session = stopOnce(session, atStop);
    const elapsedBeforeEnd = getElapsedMs(session, atStop);
    const rate = getCostPerSecondForGroup('tariff');
    const expectedCost = (elapsedBeforeEnd / 1000) * rate;
    session = stopConfirm(session, atStop);
    expect(session.finalCostEuro).toBeCloseTo(expectedCost, 2);
    expect(Math.abs((session.finalCostEuro ?? 0) - expectedCost)).toBeLessThanOrEqual(0.01);
  });

  it('stop() chains stopOnce then stopConfirm', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    session = stop(session, 5000);
    expect(session.phase).toBe('stopped_confirm');
    session = stop(session, 5000);
    expect(session.phase).toBe('ended');
    expect(session.finalElapsedMs).toBe(5000);
  });
});

describe('resume from stopped_confirm', () => {
  it('continues timing with a new segment', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    session = stopOnce(session, 10_000);
    session = start(session, 20_000);
    session = pause(session, 30_000);
    expect(getElapsedMs(session, 40_000)).toBe(20_000);
  });
});

describe('reset', () => {
  it('returns to setup and clears segments', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    session = stopOnce(session, 1000);
    session = stopConfirm(session, 1000);
    session = reset(session);
    expect(session.phase).toBe('setup');
    expect(session.segments).toEqual([]);
    expect(session.finalElapsedMs).toBeUndefined();
  });
});

describe('invalid transitions', () => {
  it('ignores pause from setup', () => {
    const session = pause(createInitialSession(), 100);
    expect(session.phase).toBe('setup');
  });

  it('ignores start from ended', () => {
    let session = sessionWithOneTariff();
    session = start(session, 0);
    session = stopOnce(session, 100);
    session = stopConfirm(session, 100);
    session = start(session, 200);
    expect(session.phase).toBe('ended');
  });
});
