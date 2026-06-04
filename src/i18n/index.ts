import type { AppLocale } from '../timer/types';
import { de } from './de';
import { en } from './en';

export const messages = { de, en } as const;

export type MessageKey = keyof typeof de;

export function t(locale: AppLocale, key: MessageKey, params?: Record<string, string>): string {
  let text: string = messages[locale][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replace(`{${name}}`, value);
    }
  }
  return text;
}

export function moneyLocale(locale: AppLocale): 'de-DE' | 'en-GB' {
  return locale === 'de' ? 'de-DE' : 'en-GB';
}
