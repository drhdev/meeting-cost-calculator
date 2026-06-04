import { afterEach, describe, expect, it } from 'vitest';
import { detectBrowserLocale } from './localeConfig';

describe('detectBrowserLocale', () => {
  const original = navigator.languages;

  afterEach(() => {
    Object.defineProperty(navigator, 'languages', {
      value: original,
      configurable: true,
    });
  });

  it('maps primary browser language tags', () => {
    Object.defineProperty(navigator, 'languages', {
      value: ['es-ES', 'en'],
      configurable: true,
    });
    expect(detectBrowserLocale()).toBe('es');
  });

  it('falls back to English for unsupported languages', () => {
    Object.defineProperty(navigator, 'languages', {
      value: ['sv-SE'],
      configurable: true,
    });
    expect(detectBrowserLocale()).toBe('en');
  });
});
