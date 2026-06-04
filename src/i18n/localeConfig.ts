export const APP_LOCALES = [
  'de',
  'en',
  'es',
  'it',
  'pt',
  'fr',
  'hi',
  'zh',
  'ja',
  'nl',
  'pl',
  'ko',
  'ru',
  'ar',
] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

/** Native names for the language selector (not translated). */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  fr: 'Français',
  hi: 'हिन्दी',
  zh: '中文',
  ja: '日本語',
  nl: 'Nederlands',
  pl: 'Polski',
  ko: '한국어',
  ru: 'Русский',
  ar: 'العربية',
};

const INTL_NUMBER_LOCALE: Record<AppLocale, string> = {
  de: 'de-DE',
  en: 'en-GB',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
  fr: 'fr-FR',
  hi: 'hi-IN',
  zh: 'zh-CN',
  ja: 'ja-JP',
  nl: 'nl-NL',
  pl: 'pl-PL',
  ko: 'ko-KR',
  ru: 'ru-RU',
  ar: 'ar-SA',
};

const BROWSER_TAG_TO_LOCALE: Record<string, AppLocale> = {
  de: 'de',
  en: 'en',
  es: 'es',
  it: 'it',
  pt: 'pt',
  fr: 'fr',
  hi: 'hi',
  zh: 'zh',
  ja: 'ja',
  nl: 'nl',
  pl: 'pl',
  ko: 'ko',
  ru: 'ru',
  ar: 'ar',
  'pt-br': 'pt',
  'pt-pt': 'pt',
  'zh-cn': 'zh',
  'zh-hans': 'zh',
  'zh-tw': 'zh',
  'zh-hant': 'zh',
};

export function isAppLocale(value: string): value is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(value);
}

export function detectBrowserLocale(): AppLocale {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const candidates =
    navigator.languages?.length > 0 ? navigator.languages : [navigator.language];

  for (const raw of candidates) {
    if (!raw) {
      continue;
    }
    const tag = raw.toLowerCase();
    const mapped = BROWSER_TAG_TO_LOCALE[tag];
    if (mapped) {
      return mapped;
    }
    const primary = tag.split('-')[0];
    if (primary) {
      const primaryMapped = BROWSER_TAG_TO_LOCALE[primary];
      if (primaryMapped) {
        return primaryMapped;
      }
    }
  }

  return DEFAULT_LOCALE;
}

export function moneyLocale(locale: AppLocale): string {
  return INTL_NUMBER_LOCALE[locale];
}

export function isRtlLocale(locale: AppLocale): boolean {
  return locale === 'ar';
}
