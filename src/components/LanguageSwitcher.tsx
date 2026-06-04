import { APP_LOCALES, LOCALE_LABELS, type AppLocale } from '../i18n/localeConfig';
import { useI18n } from '../hooks/useI18n';

interface LanguageSwitcherProps {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  const { t } = useI18n(locale);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="app-language"
        className="text-sm font-medium text-slate-600 dark:text-slate-400"
      >
        {t('setup.language')}
      </label>
      <select
        id="app-language"
        value={locale}
        onChange={(e) => onChange(e.target.value as AppLocale)}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      >
        {APP_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
