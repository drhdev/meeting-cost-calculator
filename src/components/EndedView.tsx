import { formatDuration, formatEuro } from '../domain/cost';
import { moneyLocale } from '../i18n';
import { useI18n } from '../hooks/useI18n';
import type { MeetingSession } from '../timer/types';

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
  const tipsUrl = import.meta.env.VITE_TIPS_URL ?? '#';

  return (
    <div
      className={`flex flex-1 flex-col text-center ${compact ? 'gap-3' : 'gap-8'}`}
      data-testid="ended-view"
    >
      <header>
        <h1 className={`font-bold text-white ${compact ? 'text-lg' : 'text-2xl'}`}>
          {t('ended.title')}
        </h1>
      </header>

      <div
        className={`flex flex-col gap-3 rounded-xl bg-slate-900/80 ${compact ? 'px-3 py-3' : 'gap-4 px-6 py-8'}`}
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{t('ended.duration')}</p>
          <p
            className={`mt-0.5 font-mono font-semibold tabular-nums text-white ${
              compact ? 'text-xl' : 'text-3xl'
            }`}
          >
            {formatDuration(durationMs)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-orange-300/80">{t('ended.totalCost')}</p>
          <p
            data-testid="ended-total-cost"
            className={`mt-0.5 font-mono font-semibold tabular-nums text-orange-400 ${
              compact ? 'text-xl' : 'text-3xl'
            }`}
          >
            {formatEuro(totalCost, locale)}
          </p>
        </div>
      </div>

      <p
        data-testid="ended-worth-it"
        className={`font-semibold text-slate-200 ${compact ? 'text-base' : 'text-xl'}`}
      >
        {t('ended.worthIt')}
      </p>

      <div className={`mt-auto flex flex-col ${compact ? 'gap-2' : 'gap-3'}`}>
        <a
          href={tipsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-lg bg-slate-700 font-semibold text-white hover:bg-slate-600 ${
            compact ? 'min-h-9 px-3 text-xs' : 'min-h-11 rounded-xl px-4 text-sm'
          }`}
        >
          {t('ended.tips')}
        </a>
        <button
          type="button"
          onClick={onReset}
          className={`flex items-center justify-center rounded-lg bg-orange-500 font-semibold text-white hover:bg-orange-400 ${
            compact ? 'min-h-9 px-3 text-xs' : 'min-h-11 rounded-xl px-4 text-sm'
          }`}
        >
          {t('ended.newMeeting')}
        </button>
      </div>
    </div>
  );
}
