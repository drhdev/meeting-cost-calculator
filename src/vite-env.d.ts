/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_TIPS_URL?: string;
  readonly VITE_DAYS_PER_YEAR?: string;
  readonly VITE_WEEKEND_DAYS?: string;
  readonly VITE_VACATION_DAYS?: string;
  readonly VITE_PUBLIC_HOLIDAYS?: string;
  readonly VITE_HOURS_PER_WEEK?: string;
  readonly VITE_WORK_DAYS_PER_WEEK?: string;
  readonly VITE_WORK_DAYS_PER_YEAR?: string;
  readonly VITE_SALARY_TARIFF?: string;
  readonly VITE_SALARY_NON_TARIFF?: string;
  readonly VITE_SALARY_EXECUTIVE?: string;
  readonly VITE_SALARY_BOARD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface DocumentPictureInPicture {
  readonly window: Window | null;
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
}

interface Window {
  documentPictureInPicture?: DocumentPictureInPicture;
}
