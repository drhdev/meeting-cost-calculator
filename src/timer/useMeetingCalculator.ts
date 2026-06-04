import { useCallback, useEffect, useState } from 'react';
import type { SetupPatch } from './types';
import {
  createInitialSession,
  getElapsedMs,
  getSessionDisplayedCostEuro,
  getSessionElapsedCostEuro,
  patchSetup,
  pause,
  reset,
  resume,
  start,
  stop,
} from './meetingCalculator';

const TICK_MS = 100;

export function useMeetingCalculator() {
  const [session, setSession] = useState(createInitialSession);
  const [nowPerf, setNowPerf] = useState(0);

  useEffect(() => {
    if (session.phase !== 'running') {
      return;
    }

    const updateClock = () => {
      setNowPerf(performance.now());
    };

    updateClock();
    const id = window.setInterval(updateClock, TICK_MS);
    return () => window.clearInterval(id);
  }, [session.phase]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden && session.phase === 'running') {
        setNowPerf(performance.now());
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [session.phase]);

  const effectiveNow = session.phase === 'running' ? nowPerf : 0;
  const elapsedMs = getElapsedMs(session, effectiveNow);
  const elapsedCostEuro = getSessionElapsedCostEuro(session, effectiveNow);
  const displayedCostEuro = getSessionDisplayedCostEuro(session, effectiveNow);

  const handleStart = useCallback(() => {
    const now = performance.now();
    setNowPerf(now);
    setSession((s) => start(s, now));
  }, []);

  const handlePause = useCallback(() => {
    const now = performance.now();
    setSession((s) => pause(s, now));
  }, []);

  const handleResume = useCallback(() => {
    const now = performance.now();
    setNowPerf(now);
    setSession((s) => resume(s, now));
  }, []);

  const handleStop = useCallback(() => {
    const now = performance.now();
    setSession((s) => stop(s, now));
  }, []);

  const handleReset = useCallback(() => {
    setSession((s) => reset(s));
    setNowPerf(0);
  }, []);

  const updateSetup = useCallback((patch: SetupPatch) => {
    setSession((s) => patchSetup(s, patch));
  }, []);

  return {
    session,
    elapsedMs,
    elapsedCostEuro,
    displayedCostEuro,
    start: handleStart,
    pause: handlePause,
    resume: handleResume,
    stop: handleStop,
    reset: handleReset,
    updateSetup,
  };
}
