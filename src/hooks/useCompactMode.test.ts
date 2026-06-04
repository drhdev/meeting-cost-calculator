import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompactMode } from './useCompactMode';

describe('useCompactMode', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.stubGlobal('location', {
      ...originalLocation,
      search: '',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false by default', () => {
    const { result } = renderHook(() => useCompactMode());
    expect(result.current).toBe(false);
  });

  it('returns true for ?compact=1', () => {
    vi.stubGlobal('location', { ...originalLocation, search: '?compact=1' });
    const { result } = renderHook(() => useCompactMode());
    expect(result.current).toBe(true);
  });

  it('returns true for ?view=compact', () => {
    vi.stubGlobal('location', { ...originalLocation, search: '?view=compact' });
    const { result } = renderHook(() => useCompactMode());
    expect(result.current).toBe(true);
  });

  it('updates on popstate', () => {
    const { result } = renderHook(() => useCompactMode());
    expect(result.current).toBe(false);

    vi.stubGlobal('location', { ...originalLocation, search: '?compact=1' });
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current).toBe(true);
  });
});
