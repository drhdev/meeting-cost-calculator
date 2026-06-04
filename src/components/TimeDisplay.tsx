import { formatDuration } from '../domain/cost';
import { mccSectionLabel } from '../ui/themeClasses';

interface TimeDisplayProps {
  label: string;
  elapsedMs: number;
  large?: boolean;
}

export function TimeDisplay({ label, elapsedMs, large = false }: TimeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={mccSectionLabel}>{label}</span>
      <p
        data-testid="time-display"
        className={`font-mcc-mono font-semibold tabular-nums tracking-tight text-mcc-fg dark:text-mcc-fg-inverse ${
          large ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'
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
