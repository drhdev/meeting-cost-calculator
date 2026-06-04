import { formatDuration } from '../domain/cost';

interface TimeDisplayProps {
  label: string;
  elapsedMs: number;
  large?: boolean;
}

export function TimeDisplay({ label, elapsedMs, large = false }: TimeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <p
        data-testid="time-display"
        className={`font-mono font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white ${
          large ? 'text-4xl sm:text-5xl' : 'text-2xl'
        }`}
        aria-live="polite"
        aria-atomic="true"
        role="timer"
      >
        {formatDuration(elapsedMs)}
      </p>
    </div>
  );
}
