import { APP_LOCALES, LOCALE_LABELS, type AppLocale } from '../i18n/localeConfig';
import { useI18n } from '../hooks/useI18n';
import { mccFieldInput } from '../ui/themeClasses';

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
        className="text-sm font-medium text-mcc-fg-muted dark:text-mcc-fg-muted-dark"
      >
        {t('setup.language')}
      </label>
      <select
        id="app-language"
        value={locale}
        onChange={(e) => onChange(e.target.value as AppLocale)}
        className={`${mccFieldInput} font-medium`}
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
