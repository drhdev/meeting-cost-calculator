import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';
import { ThemeToggle } from './ThemeToggle';

interface AppToolbarProps {
  locale: AppLocale;
  isDark: boolean;
  onToggleTheme: () => void;
  settingsOpen: boolean;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  settingsDisabled?: boolean;
  compact?: boolean;
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function AppToolbar({
  locale,
  isDark,
  onToggleTheme,
  settingsOpen,
  onOpenSettings,
  onCloseSettings,
  settingsDisabled = false,
  compact = false,
}: AppToolbarProps) {
  const { t } = useI18n(locale);
  const btnClass = `flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-700 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${
    compact ? 'h-9 w-9' : 'h-11 w-11'
  }`;

  return (
    <div
      className={`flex items-center justify-between gap-2 ${compact ? 'mb-2' : 'mb-4'}`}
      data-testid="app-toolbar"
    >
      <div className="min-w-0 flex-1">
        {settingsOpen ? (
          <h1
            className={`truncate font-bold text-slate-900 dark:text-white ${
              compact ? 'text-base' : 'text-lg'
            }`}
          >
            {t('settings.title')}
          </h1>
        ) : (
          <h1
            className={`truncate font-bold text-slate-900 dark:text-white ${
              compact ? 'text-base' : 'text-lg'
            }`}
          >
            {t('app.title')}
          </h1>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {settingsOpen ? (
          <button
            type="button"
            onClick={onCloseSettings}
            aria-label={t('settings.close')}
            title={t('settings.close')}
            className={btnClass}
          >
            <BackIcon />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenSettings}
            disabled={settingsDisabled}
            aria-label={t('a11y.openSettings')}
            title={t('a11y.openSettings')}
            className={`${btnClass} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <SettingsIcon />
          </button>
        )}
        <ThemeToggle
          locale={locale}
          isDark={isDark}
          onToggle={onToggleTheme}
          compact={compact}
        />
      </div>
    </div>
  );
}
