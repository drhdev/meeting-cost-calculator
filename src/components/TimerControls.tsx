import { useI18n } from '../hooks/useI18n';
import type { TimerPhase } from '../timer/types';
import type { AppLocale } from '../timer/types';

interface TimerControlsProps {
  locale: AppLocale;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onContinue?: () => void;
  onStop: () => void;
  startDisabled?: boolean;
  compact?: boolean;
}

export function TimerControls({
  locale,
  phase,
  onStart,
  onPause,
  onResume,
  onContinue,
  onStop,
  startDisabled = false,
  compact = false,
}: TimerControlsProps) {
  const { t } = useI18n(locale);

  const btnBase = `flex flex-1 items-center justify-center rounded-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${
    compact ? 'min-h-9 px-2 text-xs' : 'min-h-11 rounded-xl px-4 text-sm'
  }`;

  if (phase === 'setup') {
    return (
      <button
        type="button"
        onClick={onStart}
        disabled={startDisabled}
        className={`${btnBase} bg-orange-500 text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {t('controls.start')}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {phase === 'running' && (
          <button
            type="button"
            onClick={onPause}
            className={`${btnBase} bg-slate-700 text-white hover:bg-slate-600`}
          >
            {t('controls.pause')}
          </button>
        )}
        {phase === 'paused' && (
          <button
            type="button"
            onClick={onResume}
            className={`${btnBase} bg-orange-500 text-white hover:bg-orange-400`}
          >
            {t('controls.resume')}
          </button>
        )}
        {phase === 'stopped_confirm' && onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className={`${btnBase} bg-slate-700 text-white hover:bg-slate-600`}
          >
            {t('controls.resume')}
          </button>
        )}
        <button
          type="button"
          onClick={onStop}
          className={`${btnBase} ${
            phase === 'stopped_confirm'
              ? 'animate-pulse bg-red-600 text-white ring-2 ring-red-400 ring-offset-2 ring-offset-slate-950 hover:bg-red-500 motion-reduce:animate-none'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
        >
          {t('controls.stop')}
        </button>
      </div>
      {phase === 'stopped_confirm' && (
        <p className="text-center text-sm font-medium text-amber-400">{t('stopped.hint')}</p>
      )}
    </div>
  );
}
