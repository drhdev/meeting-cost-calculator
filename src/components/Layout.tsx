import type { ReactNode } from 'react';
import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';

interface LayoutProps {
  locale: AppLocale;
  children: ReactNode;
  compact?: boolean;
}

export function Layout({ locale, children, compact = false }: LayoutProps) {
  const { t } = useI18n(locale);

  return (
    <div
      className={`flex min-h-dvh flex-col overflow-x-hidden bg-slate-950 text-slate-100 ${compact ? 'p-2' : 'px-4 py-6'}`}
    >
      <main
        className={`mx-auto flex w-full flex-1 flex-col ${compact ? 'max-w-full gap-2' : 'max-w-lg gap-6'}`}
      >
        {children}
      </main>
      <footer
        className={`mx-auto px-1 text-center text-slate-500 ${
          compact ? 'mt-2 max-w-full text-[10px] leading-tight' : 'mt-6 max-w-lg text-xs'
        }`}
        role="note"
      >
        {t('disclaimer.model')}
      </footer>
    </div>
  );
}
