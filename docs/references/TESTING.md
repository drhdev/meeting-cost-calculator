# Testing — MCC

Quellen: [vitest.dev](https://vitest.dev/guide/), [testing-library.com](https://testing-library.com/docs/guiding-principles), [playwright.dev](https://playwright.dev/docs/best-practices)

## Pyramide

```
        ┌─────────────┐
        │  Playwright │  wenige E2E-Flows
        ├─────────────┤
        │  RTL + jsdom│  Komponenten-Verhalten
        ├─────────────┤
        │  Vitest     │  domain + timer (bulk)
        └─────────────┘
```

MCC nutzt **jsdom + RTL** für Unit/Komponenten (einfach, schnell).  
Vitest Browser Mode ist optional — nicht Pflicht in v1.

## Vitest (`vitest.config.ts`)

```ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/domain/**', 'src/timer/**'],
    },
  },
});
```

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

## Domain-Tests (Pflicht)

- Golden values für €/s pro Gruppe
- `quantizeCostDisplay` Grenzfälle
- `formatDuration`, `formatEuro` Locales

## Timer-Tests (Pflicht)

```ts
vi.useFakeTimers();
// start → advance → pause → advance → resume → stop → stop
vi.useRealTimers();
```

- Pause addiert keine elapsed time
- `stopped_confirm` → `ended` setzt `finalElapsedMs`

## RTL — Komponenten

```tsx
// ✅ User-zentriert
screen.getByRole('button', { name: /start/i });
await userEvent.click(screen.getByRole('button', { name: '+' }));

// ❌ Implementation
container.querySelector('.timer-state-running');
```

## Playwright (`e2e/`)

| Spec | Flow |
|------|------|
| `meeting-flow.spec.ts` | Setup → Start → Stop → Stop → Ended |
| `compact-mode.spec.ts` | `?compact=1`, Viewport 320×200 |

Best Practices:

- `baseURL` in config → `http://localhost:4173` (preview) oder dev mit webServer
- `getByRole` bevorzugen
- Keine `waitForTimeout` — `expect(locator).toBeVisible()`

```ts
// playwright.config.ts
webServer: {
  command: 'npm run preview',
  port: 4173,
  reuseExistingServer: !process.env.CI,
},
```

## CI-Reihenfolge

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install --with-deps
npm run test:e2e
```

## Was nicht testen

- Tailwind-Klassennamen
- Exakte Pixel-Layouts
- Workbox-Internals (nur Build-Artefakt prüfen)
