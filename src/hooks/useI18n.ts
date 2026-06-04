import { useMemo } from 'react';
import { t, type MessageKey } from '../i18n';
import type { AppLocale } from '../timer/types';

export function useI18n(locale: AppLocale) {
  return useMemo(
    () => ({
      t: (key: MessageKey, params?: Record<string, string>) => t(locale, key, params),
      locale,
    }),
    [locale],
  );
}
