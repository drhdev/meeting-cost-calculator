import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMeetingTimer } from './useMeetingTimer';

describe('useMeetingTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exports session and timer actions', () => {
    const { result } = renderHook(() => useMeetingTimer());
    expect(result.current.session.phase).toBe('setup');
    expect(typeof result.current.start).toBe('function');
    expect(typeof result.current.pause).toBe('function');
    expect(typeof result.current.resume).toBe('function');
    expect(typeof result.current.stop).toBe('function');
    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.updateSetup).toBe('function');
  });

  it('updates elapsed while running', () => {
    const { result } = renderHook(() => useMeetingTimer());

    act(() => {
      result.current.updateSetup({
        participants: {
          tariff: 1,
          non_tariff: 0,
          executive: 0,
          board: 0,
        },
      });
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.session.phase).toBe('running');
    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(2000);
    expect(result.current.elapsedCostEuro).toBeGreaterThan(0);
  });

  it('does not advance elapsed while paused', () => {
    const { result } = renderHook(() => useMeetingTimer());

    act(() => {
      result.current.updateSetup({
        participants: {
          tariff: 1,
          non_tariff: 0,
          executive: 0,
          board: 0,
        },
      });
      result.current.start();
      vi.advanceTimersByTime(1000);
      result.current.pause();
    });

    const pausedElapsed = result.current.elapsedMs;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.elapsedMs).toBe(pausedElapsed);
  });
});
