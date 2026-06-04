import { APP_CONFIG } from '../config/env';
import { formatDuration, formatEuro } from '../domain/cost';
import type { MessageKey } from '../i18n';
import { moneyLocale } from '../i18n';
import { useI18n } from '../hooks/useI18n';
import type { MeetingSession } from '../timer/types';
import { mccCostLabel, mccCostValue, mccHeading, mccPrimaryButton } from '../ui/themeClasses';

const REFLECTION_KEYS: MessageKey[] = [
  'ended.reflection.goals',
  'ended.reflection.value',
  'ended.reflection.attendance',
];

interface EndedViewProps {
  session: MeetingSession;
  onReset: () => void;
  compact?: boolean;
}

export function EndedView({ session, onReset, compact = false }: EndedViewProps) {
  const { t } = useI18n(session.locale);
  const locale = moneyLocale(session.locale);
  const durationMs = session.finalElapsedMs ?? 0;
  const totalCost = session.finalCostEuro ?? 0;
  const tipsUrl = APP_CONFIG.tipsUrl;

  return (
    <div
      className={`flex flex-1 flex-col text-center ${compact ? 'gap-3' : 'gap-8'}`}
      data-testid="ended-view"
    >
      <header>
        <h1
          className={`${mccHeading} ${compact ? 'text-lg' : 'text-2xl'}`}
        >
          {t('ended.title')}
        </h1>
      </header>

      <div
        className={`flex flex-col gap-3 rounded-xl border border-mcc-border bg-mcc-panel/90 shadow-sm dark:border-transparent dark:bg-mcc-bg/80 dark:shadow-none ${compact ? 'px-3 py-3' : 'gap-4 px-6 py-8'}`}
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-mcc-fg-subtle">{t('ended.duration')}</p>
          <p
            className={`mt-0.5 font-mcc-mono font-semibold tabular-nums text-mcc-fg dark:text-mcc-fg-inverse ${
              compact ? 'text-4xl' : 'text-5xl sm:text-6xl'
            }`}
          >
            {formatDuration(durationMs)}
          </p>
        </div>
        <div>
          <p className={mccCostLabel}>{t('ended.totalCost')}</p>
          <p
            data-testid="ended-total-cost"
            className={`mt-0.5 ${mccCostValue} ${
              compact ? 'text-4xl' : 'text-5xl sm:text-6xl'
            }`}
          >
            {formatEuro(totalCost, locale)}
          </p>
        </div>
      </div>

      <section
        data-testid="ended-reflection"
        className={`mx-auto w-full max-w-md text-left ${compact ? 'space-y-3' : 'space-y-4'}`}
      >
        <h2
          className={`font-semibold uppercase tracking-wide text-mcc-fg-subtle ${
            compact ? 'text-[10px]' : 'text-xs'
          }`}
        >
          {t('ended.reflection.title')}
        </h2>
        <ul
          className={`list-disc space-y-2 pl-5 text-mcc-fg-body dark:text-mcc-fg-on-dark ${
            compact ? 'text-xs leading-snug' : 'text-sm leading-relaxed'
          }`}
        >
          {REFLECTION_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
        <p
          className={`border-t border-mcc-border pt-3 font-medium text-mcc-fg-body dark:border-mcc-border-subtle dark:text-mcc-fg-on-dark ${
            compact ? 'text-xs leading-snug' : 'text-sm leading-relaxed'
          }`}
        >
          {t('ended.reflection.nextTime')}
        </p>
      </section>

      <div className={`mt-auto flex flex-col ${compact ? 'gap-2' : 'gap-3'}`}>
        <a
          href={tipsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-lg bg-mcc-control font-semibold text-mcc-fg hover:bg-mcc-control-hover dark:bg-mcc-control-dark dark:text-mcc-fg-inverse dark:hover:bg-mcc-control-dark-hover ${
            compact ? 'min-h-9 px-3 text-xs' : 'min-h-11 rounded-xl px-4 text-sm'
          }`}
        >
          {t('ended.tips')}
        </a>
        <button
          type="button"
          onClick={onReset}
          className={`flex items-center justify-center rounded-lg ${mccPrimaryButton} ${
            compact ? 'min-h-9 px-3 text-xs' : 'min-h-11 rounded-xl px-4 text-sm'
          }`}
        >
          {t('ended.newMeeting')}
        </button>
      </div>
    </div>
  );
}
