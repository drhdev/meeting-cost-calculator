import type { AppLocale } from './localeConfig';
import type { MessageKey, Messages } from './messagesType';
import { ar } from './ar';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { hi } from './hi';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { nl } from './nl';
import { pl } from './pl';
import { pt } from './pt';
import { ru } from './ru';
import { zh } from './zh';

export { APP_LOCALES, detectBrowserLocale, isAppLocale, isRtlLocale, LOCALE_LABELS, moneyLocale } from './localeConfig';
export type { AppLocale } from './localeConfig';

export const messages = {
  de,
  en,
  es,
  it,
  pt,
  fr,
  hi,
  zh,
  ja,
  nl,
  pl,
  ko,
  ru,
  ar,
} as const satisfies Record<AppLocale, Messages>;

export type { MessageKey } from './messagesType';

export function t(locale: AppLocale, key: MessageKey, params?: Record<string, string>): string {
  let text: string = messages[locale][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replace(`{${name}}`, value);
    }
  }
  return text;
}
