import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { getDisclaimerParams } from '../config/disclaimer';
import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';
import { mccPageShell } from '../ui/themeClasses';

interface LayoutProps {
  locale: AppLocale;
  children: ReactNode;
  toolbar?: ReactNode;
  compact?: boolean;
}

export function Layout({ locale, children, toolbar, compact = false }: LayoutProps) {
  const { t } = useI18n(locale);
  const disclaimerParams = useMemo(() => getDisclaimerParams(locale), [locale]);

  return (
    <div
      className={`flex min-h-dvh flex-col overflow-x-hidden ${mccPageShell} ${compact ? 'p-2' : 'px-4 py-6'}`}
    >
      <main
        className={`mx-auto flex w-full flex-1 flex-col ${compact ? 'max-w-full gap-2' : 'max-w-lg gap-6'}`}
      >
        {toolbar}
        {children}
      </main>
      <footer
        className={`mx-auto flex flex-col gap-1 px-1 text-center text-mcc-fg-muted dark:text-mcc-fg-subtle ${
          compact ? 'mt-2 max-w-full text-[10px] leading-tight' : 'mt-6 max-w-lg text-xs'
        }`}
        role="note"
      >
        <p>{t('disclaimer.model', disclaimerParams)}</p>
        <p>{t('disclaimer.noDataStored')}</p>
      </footer>
    </div>
  );
}
