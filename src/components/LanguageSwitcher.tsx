import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';

interface LanguageSwitcherProps {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  const { t } = useI18n(locale);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-400">{t('setup.language')}</span>
      <div className="inline-flex rounded-lg bg-slate-800 p-1" role="group" aria-label={t('setup.language')}>
        {(['de', 'en'] as const).map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={locale === code}
            onClick={() => onChange(code)}
            className={`min-h-11 min-w-14 rounded-md px-4 text-sm font-semibold transition-colors ${
              locale === code
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
