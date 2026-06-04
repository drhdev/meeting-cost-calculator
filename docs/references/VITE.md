# Vite 8 — MCT Setup

Quellen: [vite.dev/guide](https://vite.dev/guide/), [Vite 8 Release](https://vite.dev/blog/announcing-vite8)

## Minimale `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({ /* siehe PWA.md */ }),
  ],
});
```

## MCT-spezifische Einstellungen

| Option | Wert | Grund |
|--------|------|-------|
| `base` | `'/'` | Coolify Root-Deploy |
| `build.outDir` | `dist` | nginx COPY |
| `build.sourcemap` | `true` in CI optional | Debugging Prod |
| Env-Prefix | `VITE_` | `VITE_TIPS_URL` |

## Scripts (`package.json`)

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b --noEmit"
}
```

**Wichtig:** Typecheck separat — Vite transpiliert TS, ersetzt aber kein vollständiges `tsc`.

## CSS Entry

- `main.tsx` importiert `./index.css`
- `index.css`: `@import "tailwindcss";` + `@theme { }`

## Dev Server

- Port default 5173 — in README dokumentieren
- HMR für React Fast Refresh via `@vitejs/plugin-react` v6

## Production Build

- Target: Baseline Widely Available (Vite-Default) — ausreichend für B2B-Browser
- Kein SSR — reine SPA
- Asset-Hashing automatisch — nginx cache für `/assets/*`

## Anti-Patterns

- `rollupOptions` / `esbuild` manuell tweaken ohne Grund (Vite 8 = Rolldown)
- CommonJS in App-Code (ESM only)
- Mehrere HTML-Entry-Points (nicht nötig für MCT)

## Upgrade Vite 7 → 8

1. [Migration Guide](https://vite.dev/guide/migration) lesen
2. Node auf 22 LTS
3. Plugin-Peers prüfen (`vite-plugin-pwa`, `@tailwindcss/vite`)
