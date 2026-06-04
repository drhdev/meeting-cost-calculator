import { GROUP_KEYS, GROUPS } from '../domain/constants';
import { formatEuro } from '../domain/cost';
import { moneyLocale, type MessageKey } from '../i18n';
import { getSessionRatePerSecond } from '../timer/meetingTimer';
import type { MeetingSession } from '../timer/types';
import { useI18n } from '../hooks/useI18n';
import { CostDisplay } from './CostDisplay';
import { TimeDisplay } from './TimeDisplay';
import { TimerControls } from './TimerControls';

export interface RunningViewProps {
  session: MeetingSession;
  elapsedMs: number;
  displayedCostEuro: number;
  onPause: () => void;
  onResume: () => void;
  onContinue: () => void;
  onStop: () => void;
  compact?: boolean;
}

export function RunningView({
  session,
  elapsedMs,
  displayedCostEuro,
  onPause,
  onResume,
  onContinue,
  onStop,
  compact = false,
}: RunningViewProps) {
  const { t } = useI18n(session.locale);
  const ratePerSecond = getSessionRatePerSecond(session);
  const ratePerMinute = ratePerSecond * 60;
  const rateLabel =
    ratePerMinute > 0
      ? t('running.ratePerMin', {
          rate: formatEuro(ratePerMinute, moneyLocale(session.locale)),
        })
      : undefined;

  const activeGroups = GROUP_KEYS.filter((g) => session.participants[g] > 0);

  if (compact) {
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-2" data-compact="true">
        {session.phase === 'paused' && (
          <p className="text-center text-xs font-semibold text-amber-400" role="status">
            {t('running.paused')}
          </p>
        )}
        <div className="flex min-w-0 items-start justify-between gap-2 rounded-lg bg-slate-900/90 px-2 py-2">
          <TimeDisplay label={t('running.elapsed')} elapsedMs={elapsedMs} />
          <CostDisplay
            locale={session.locale}
            label={t('running.cost')}
            displayedCostEuro={displayedCostEuro}
          />
        </div>
        <TimerControls
          locale={session.locale}
          phase={session.phase}
          onStart={onResume}
          onPause={onPause}
          onResume={onResume}
          onContinue={onContinue}
          onStop={onStop}
          compact
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {session.phase === 'paused' && (
        <p
          className="rounded-lg bg-amber-500/15 py-2 text-center text-sm font-semibold text-amber-400"
          role="status"
        >
          {t('running.paused')}
        </p>
      )}

      <div className="flex flex-col gap-8 rounded-2xl bg-slate-900/80 px-4 py-8">
        <TimeDisplay label={t('running.elapsed')} elapsedMs={elapsedMs} large />
        <CostDisplay
          locale={session.locale}
          label={t('running.cost')}
          displayedCostEuro={displayedCostEuro}
          ratePerMinute={ratePerMinute}
          rateLabel={rateLabel}
          large
        />
      </div>

      {activeGroups.length > 0 && (
        <div className="rounded-xl bg-slate-800/60 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('running.participants')}
          </p>
          <ul className="flex flex-wrap gap-2 text-sm text-slate-300">
            {activeGroups.map((group) => (
              <li
                key={group}
                className="rounded-md bg-slate-700/80 px-2 py-1 font-mono tabular-nums"
              >
                {session.participants[group]}× {t(GROUPS[group].i18nKey as MessageKey)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <TimerControls
        locale={session.locale}
        phase={session.phase}
        onStart={onResume}
        onPause={onPause}
        onResume={onResume}
        onContinue={onContinue}
        onStop={onStop}
      />
    </div>
  );
}
