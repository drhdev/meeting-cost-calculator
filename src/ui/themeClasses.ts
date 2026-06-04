/** Shared Tailwind class fragments — use mcc-* tokens from src/index.css @theme */

export const mccFocusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcc-accent';

export const mccIconButton = `flex shrink-0 items-center justify-center rounded-lg border border-mcc-border-strong bg-mcc-bg-light text-mcc-fg-secondary transition hover:bg-mcc-control ${mccFocusRing} dark:border-mcc-border-dark dark:bg-mcc-surface dark:text-mcc-fg-on-dark dark:hover:bg-mcc-control-dark`;

export const mccFieldInput = `min-h-11 w-full rounded-lg border border-mcc-border-strong bg-mcc-panel px-3 text-sm text-mcc-fg placeholder:text-mcc-fg-placeholder ${mccFocusRing} dark:border-mcc-border-dark dark:bg-mcc-bg dark:text-mcc-fg-light dark:placeholder:text-mcc-fg-subtle`;

export const mccPageShell = 'bg-mcc-bg-light text-mcc-fg dark:bg-mcc-bg dark:text-mcc-fg-light';

export const mccHeading = 'font-bold text-mcc-fg dark:text-mcc-fg-inverse';

export const mccSectionLabel = 'text-xs font-medium uppercase tracking-wide text-mcc-fg-subtle dark:text-mcc-fg-muted-dark';

export const mccWarningText = 'text-mcc-warning dark:text-mcc-warning-dark';

export const mccWarningBanner =
  'rounded-lg bg-mcc-warning-emphasis/10 py-2 text-center text-sm text-mcc-warning dark:text-mcc-warning-dark';

export const mccCostLabel = 'text-xs font-medium uppercase tracking-wide text-mcc-cost-label/80';

export const mccCostValue = 'font-mcc-mono font-semibold tabular-nums tracking-tight text-mcc-cost';

export const mccPrimaryButton = `bg-mcc-accent font-semibold text-mcc-on-accent transition hover:bg-mcc-accent-hover ${mccFocusRing}`;
